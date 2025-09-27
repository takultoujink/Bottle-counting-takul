# ========================================
# Docker Setup และ CI/CD Pipeline
# ========================================

import os
import json
import yaml
import subprocess
import logging
from pathlib import Path
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
import docker
import requests
from datetime import datetime

# Import configuration
import sys
sys.path.append(str(Path(__file__).parent.parent / "08_Config"))
from security_config import SecureConfig

@dataclass
class DockerConfig:
    """คลาสสำหรับ Docker configuration"""
    image_name: str
    tag: str
    base_image: str
    python_version: str
    working_dir: str
    exposed_ports: List[int]
    environment_vars: Dict[str, str]
    volumes: List[str]
    dependencies: List[str]
    build_args: Dict[str, str]

@dataclass
class CIConfig:
    """คลาสสำหรับ CI/CD configuration"""
    platform: str  # 'github', 'gitlab', 'jenkins'
    triggers: List[str]
    stages: List[str]
    test_commands: List[str]
    build_commands: List[str]
    deploy_commands: List[str]
    environment_vars: Dict[str, str]
    secrets: List[str]

class DockerManager:
    """คลาสสำหรับจัดการ Docker"""
    
    def __init__(self, config_path: Optional[str] = None):
        self.config = SecureConfig(config_path)
        self.logger = self._setup_logging()
        
        # Docker client
        try:
            self.docker_client = docker.from_env()
        except Exception as e:
            self.logger.error(f"Failed to connect to Docker: {e}")
            self.docker_client = None
        
        # Paths
        self.project_root = Path.cwd()
        self.docker_dir = self.project_root / "docker"
        self.docker_dir.mkdir(exist_ok=True)
        
        # Default configurations
        self.default_docker_config = DockerConfig(
            image_name="object-detection-app",
            tag="latest",
            base_image="python:3.9-slim",
            python_version="3.9",
            working_dir="/app",
            exposed_ports=[8000, 5000],
            environment_vars={
                "PYTHONPATH": "/app",
                "PYTHONUNBUFFERED": "1"
            },
            volumes=["/app/data", "/app/logs"],
            dependencies=[
                "opencv-python-headless",
                "ultralytics",
                "firebase-admin",
                "fastapi",
                "uvicorn",
                "numpy",
                "pillow",
                "python-multipart",
                "psutil",
                "schedule"
            ],
            build_args={}
        )
    
    def _setup_logging(self) -> logging.Logger:
        """ตั้งค่า logging"""
        logger = logging.getLogger("DockerManager")
        logger.setLevel(logging.INFO)
        
        if not logger.handlers:
            handler = logging.FileHandler("docker_manager.log")
            formatter = logging.Formatter(
                '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
            )
            handler.setFormatter(formatter)
            logger.addHandler(handler)
        
        return logger
    
    def generate_dockerfile(self, config: Optional[DockerConfig] = None) -> str:
        """สร้าง Dockerfile"""
        if not config:
            config = self.default_docker_config
        
        dockerfile_content = f"""# ========================================
# Dockerfile for Object Detection Application
# ========================================

FROM {config.base_image}

# Set working directory
WORKDIR {config.working_dir}

# Install system dependencies
RUN apt-get update && apt-get install -y \\
    libgl1-mesa-glx \\
    libglib2.0-0 \\
    libsm6 \\
    libxext6 \\
    libxrender-dev \\
    libgomp1 \\
    libgthread-2.0-0 \\
    libgtk-3-0 \\
    libavcodec-dev \\
    libavformat-dev \\
    libswscale-dev \\
    libv4l-dev \\
    libxvidcore-dev \\
    libx264-dev \\
    libjpeg-dev \\
    libpng-dev \\
    libtiff-dev \\
    libatlas-base-dev \\
    gfortran \\
    wget \\
    curl \\
    git \\
    && rm -rf /var/lib/apt/lists/*

# Set environment variables
"""
        
        for key, value in config.environment_vars.items():
            dockerfile_content += f"ENV {key}={value}\n"
        
        dockerfile_content += f"""
# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip && \\
    pip install --no-cache-dir -r requirements.txt

# Install additional dependencies
"""
        
        for dep in config.dependencies:
            dockerfile_content += f"RUN pip install --no-cache-dir {dep}\n"
        
        dockerfile_content += f"""
# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p /app/data /app/logs /app/models /app/temp

# Set permissions
RUN chmod +x /app/main.py

# Create non-root user
RUN useradd -m -u 1000 appuser && \\
    chown -R appuser:appuser /app
USER appuser

# Expose ports
"""
        
        for port in config.exposed_ports:
            dockerfile_content += f"EXPOSE {port}\n"
        
        dockerfile_content += f"""
# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \\
    CMD curl -f http://localhost:8000/health || exit 1

# Default command
CMD ["python", "main.py"]
"""
        
        return dockerfile_content
    
    def generate_docker_compose(self, config: Optional[DockerConfig] = None) -> str:
        """สร้าง docker-compose.yml"""
        if not config:
            config = self.default_docker_config
        
        compose_content = f"""version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    image: {config.image_name}:{config.tag}
    container_name: object-detection-app
    restart: unless-stopped
    ports:"""
        
        for port in config.exposed_ports:
            compose_content += f"\n      - \"{port}:{port}\""
        
        compose_content += f"""
    volumes:
      - ./data:/app/data
      - ./logs:/app/logs
      - ./models:/app/models
      - ./config:/app/config
    environment:"""
        
        for key, value in config.environment_vars.items():
            compose_content += f"\n      - {key}={value}"
        
        compose_content += f"""
    networks:
      - app-network
    depends_on:
      - redis
      - postgres
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s

  redis:
    image: redis:7-alpine
    container_name: object-detection-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - app-network
    command: redis-server --appendonly yes

  postgres:
    image: postgres:15-alpine
    container_name: object-detection-postgres
    restart: unless-stopped
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=object_detection
      - POSTGRES_USER=app_user
      - POSTGRES_PASSWORD=secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./docker/postgres/init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    container_name: object-detection-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./docker/nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./docker/nginx/ssl:/etc/nginx/ssl
    networks:
      - app-network
    depends_on:
      - app

  monitoring:
    image: prom/prometheus:latest
    container_name: object-detection-monitoring
    restart: unless-stopped
    ports:
      - "9090:9090"
    volumes:
      - ./docker/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    networks:
      - app-network

  grafana:
    image: grafana/grafana:latest
    container_name: object-detection-grafana
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin123
    volumes:
      - grafana_data:/var/lib/grafana
      - ./docker/grafana/dashboards:/etc/grafana/provisioning/dashboards
    networks:
      - app-network

volumes:
  redis_data:
  postgres_data:
  prometheus_data:
  grafana_data:

networks:
  app-network:
    driver: bridge
"""
        
        return compose_content
    
    def generate_requirements_txt(self, config: Optional[DockerConfig] = None) -> str:
        """สร้าง requirements.txt"""
        if not config:
            config = self.default_docker_config
        
        requirements = [
            "# Core dependencies",
            "fastapi==0.104.1",
            "uvicorn[standard]==0.24.0",
            "python-multipart==0.0.6",
            "",
            "# Computer Vision",
            "opencv-python-headless==4.8.1.78",
            "ultralytics==8.0.206",
            "numpy==1.24.3",
            "pillow==10.0.1",
            "",
            "# Firebase",
            "firebase-admin==6.2.0",
            "google-cloud-firestore==2.13.1",
            "",
            "# Serial Communication",
            "pyserial==3.5",
            "",
            "# System Monitoring",
            "psutil==5.9.6",
            "schedule==1.2.0",
            "",
            "# Security",
            "cryptography==41.0.7",
            "bcrypt==4.1.2",
            "",
            "# Database",
            "sqlalchemy==2.0.23",
            "alembic==1.12.1",
            "",
            "# Testing",
            "pytest==7.4.3",
            "pytest-asyncio==0.21.1",
            "pytest-cov==4.1.0",
            "",
            "# Development",
            "black==23.11.0",
            "flake8==6.1.0",
            "mypy==1.7.1",
            "",
            "# Additional dependencies"
        ]
        
        for dep in config.dependencies:
            if dep not in [req.split("==")[0] for req in requirements]:
                requirements.append(dep)
        
        return "\n".join(requirements)
    
    def generate_dockerignore(self) -> str:
        """สร้าง .dockerignore"""
        return """# Git
.git
.gitignore

# Python
__pycache__
*.pyc
*.pyo
*.pyd
.Python
env
pip-log.txt
pip-delete-this-directory.txt
.tox
.coverage
.coverage.*
.cache
nosetests.xml
coverage.xml
*.cover
*.log
.git
.mypy_cache
.pytest_cache
.hypothesis

# Virtual environments
venv/
env/
ENV/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Project specific
logs/
temp/
*.tmp
*.bak
*.backup

# Docker
Dockerfile*
docker-compose*
.dockerignore

# Documentation
README.md
docs/

# Tests
tests/
test_*

# Large files
*.mp4
*.avi
*.mov
*.mkv
models/*.pt
models/*.onnx
"""
    
    def generate_nginx_config(self) -> str:
        """สร้าง Nginx configuration"""
        return """events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:8000;
    }

    server {
        listen 80;
        server_name localhost;

        # Redirect HTTP to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name localhost;

        # SSL Configuration
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

        # File upload size
        client_max_body_size 100M;

        # Proxy settings
        location / {
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # WebSocket support
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            
            # Timeouts
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        # Static files
        location /static/ {
            alias /app/static/;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Health check
        location /health {
            proxy_pass http://app/health;
            access_log off;
        }

        # Monitoring endpoints
        location /metrics {
            proxy_pass http://app/metrics;
            allow 127.0.0.1;
            allow 10.0.0.0/8;
            allow 172.16.0.0/12;
            allow 192.168.0.0/16;
            deny all;
        }
    }
}
"""
    
    def generate_prometheus_config(self) -> str:
        """สร้าง Prometheus configuration"""
        return """global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  # - "first_rules.yml"
  # - "second_rules.yml"

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'object-detection-app'
    static_configs:
      - targets: ['app:8000']
    metrics_path: '/metrics'
    scrape_interval: 30s

  - job_name: 'redis'
    static_configs:
      - targets: ['redis:6379']

  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres:5432']

  - job_name: 'nginx'
    static_configs:
      - targets: ['nginx:80']
"""
    
    def create_docker_files(self, config: Optional[DockerConfig] = None):
        """สร้างไฟล์ Docker ทั้งหมด"""
        try:
            # สร้าง Dockerfile
            dockerfile_content = self.generate_dockerfile(config)
            with open(self.project_root / "Dockerfile", 'w') as f:
                f.write(dockerfile_content)
            
            # สร้าง docker-compose.yml
            compose_content = self.generate_docker_compose(config)
            with open(self.project_root / "docker-compose.yml", 'w') as f:
                f.write(compose_content)
            
            # สร้าง requirements.txt
            requirements_content = self.generate_requirements_txt(config)
            with open(self.project_root / "requirements.txt", 'w') as f:
                f.write(requirements_content)
            
            # สร้าง .dockerignore
            dockerignore_content = self.generate_dockerignore()
            with open(self.project_root / ".dockerignore", 'w') as f:
                f.write(dockerignore_content)
            
            # สร้าง nginx config
            nginx_dir = self.docker_dir / "nginx"
            nginx_dir.mkdir(exist_ok=True)
            
            nginx_config = self.generate_nginx_config()
            with open(nginx_dir / "nginx.conf", 'w') as f:
                f.write(nginx_config)
            
            # สร้าง prometheus config
            prometheus_dir = self.docker_dir / "prometheus"
            prometheus_dir.mkdir(exist_ok=True)
            
            prometheus_config = self.generate_prometheus_config()
            with open(prometheus_dir / "prometheus.yml", 'w') as f:
                f.write(prometheus_config)
            
            # สร้าง SSL certificates directory
            ssl_dir = nginx_dir / "ssl"
            ssl_dir.mkdir(exist_ok=True)
            
            # สร้าง Grafana dashboards directory
            grafana_dir = self.docker_dir / "grafana" / "dashboards"
            grafana_dir.mkdir(parents=True, exist_ok=True)
            
            # สร้าง PostgreSQL init script
            postgres_dir = self.docker_dir / "postgres"
            postgres_dir.mkdir(exist_ok=True)
            
            postgres_init = """-- Initialize database for object detection app
CREATE DATABASE IF NOT EXISTS object_detection;
CREATE USER IF NOT EXISTS app_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE object_detection TO app_user;

-- Create tables
\\c object_detection;

CREATE TABLE IF NOT EXISTS detections (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    image_path VARCHAR(255),
    objects_detected JSONB,
    confidence_scores JSONB,
    processing_time_ms FLOAT
);

CREATE INDEX idx_detections_timestamp ON detections(timestamp);
"""
            
            with open(postgres_dir / "init.sql", 'w') as f:
                f.write(postgres_init)
            
            self.logger.info("Docker files created successfully")
            
        except Exception as e:
            self.logger.error(f"Error creating Docker files: {e}")
            raise
    
    def build_image(self, config: Optional[DockerConfig] = None, no_cache: bool = False) -> bool:
        """Build Docker image"""
        if not self.docker_client:
            self.logger.error("Docker client not available")
            return False
        
        if not config:
            config = self.default_docker_config
        
        try:
            self.logger.info(f"Building Docker image: {config.image_name}:{config.tag}")
            
            # Build image
            image, build_logs = self.docker_client.images.build(
                path=str(self.project_root),
                tag=f"{config.image_name}:{config.tag}",
                nocache=no_cache,
                rm=True,
                forcerm=True
            )
            
            # Log build output
            for log in build_logs:
                if 'stream' in log:
                    self.logger.info(log['stream'].strip())
            
            self.logger.info(f"Image built successfully: {image.id}")
            return True
            
        except Exception as e:
            self.logger.error(f"Error building Docker image: {e}")
            return False
    
    def run_container(self, config: Optional[DockerConfig] = None, detach: bool = True) -> Optional[str]:
        """Run Docker container"""
        if not self.docker_client:
            self.logger.error("Docker client not available")
            return None
        
        if not config:
            config = self.default_docker_config
        
        try:
            # Port mapping
            ports = {}
            for port in config.exposed_ports:
                ports[f"{port}/tcp"] = port
            
            # Volume mapping
            volumes = {
                str(self.project_root / "data"): {"bind": "/app/data", "mode": "rw"},
                str(self.project_root / "logs"): {"bind": "/app/logs", "mode": "rw"},
                str(self.project_root / "models"): {"bind": "/app/models", "mode": "rw"},
                str(self.project_root / "config"): {"bind": "/app/config", "mode": "rw"}
            }
            
            # Run container
            container = self.docker_client.containers.run(
                f"{config.image_name}:{config.tag}",
                detach=detach,
                ports=ports,
                volumes=volumes,
                environment=config.environment_vars,
                name=f"{config.image_name}-container",
                restart_policy={"Name": "unless-stopped"}
            )
            
            self.logger.info(f"Container started: {container.id}")
            return container.id
            
        except Exception as e:
            self.logger.error(f"Error running container: {e}")
            return None
    
    def stop_container(self, container_name: str) -> bool:
        """Stop Docker container"""
        if not self.docker_client:
            return False
        
        try:
            container = self.docker_client.containers.get(container_name)
            container.stop()
            container.remove()
            
            self.logger.info(f"Container stopped and removed: {container_name}")
            return True
            
        except Exception as e:
            self.logger.error(f"Error stopping container: {e}")
            return False
    
    def get_container_logs(self, container_name: str, tail: int = 100) -> str:
        """Get container logs"""
        if not self.docker_client:
            return ""
        
        try:
            container = self.docker_client.containers.get(container_name)
            logs = container.logs(tail=tail, timestamps=True)
            return logs.decode('utf-8')
            
        except Exception as e:
            self.logger.error(f"Error getting container logs: {e}")
            return ""

class CIPipelineManager:
    """คลาสสำหรับจัดการ CI/CD Pipeline"""
    
    def __init__(self, config_path: Optional[str] = None):
        self.config = SecureConfig(config_path)
        self.logger = self._setup_logging()
        self.project_root = Path.cwd()
    
    def _setup_logging(self) -> logging.Logger:
        """ตั้งค่า logging"""
        logger = logging.getLogger("CIPipelineManager")
        logger.setLevel(logging.INFO)
        
        if not logger.handlers:
            handler = logging.FileHandler("ci_pipeline.log")
            formatter = logging.Formatter(
                '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
            )
            handler.setFormatter(formatter)
            logger.addHandler(handler)
        
        return logger
    
    def generate_github_workflow(self, config: Optional[CIConfig] = None) -> str:
        """สร้าง GitHub Actions workflow"""
        if not config:
            config = CIConfig(
                platform="github",
                triggers=["push", "pull_request"],
                stages=["test", "build", "deploy"],
                test_commands=["pytest", "flake8", "mypy"],
                build_commands=["docker build"],
                deploy_commands=["docker push"],
                environment_vars={},
                secrets=["DOCKER_USERNAME", "DOCKER_PASSWORD"]
            )
        
        workflow = f"""name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  DOCKER_IMAGE: object-detection-app
  DOCKER_TAG: ${{{{ github.sha }}}}

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.9'
    
    - name: Cache dependencies
      uses: actions/cache@v3
      with:
        path: ~/.cache/pip
        key: ${{{{ runner.os }}}}-pip-${{{{ hashFiles('**/requirements.txt') }}}}
        restore-keys: |
          ${{{{ runner.os }}}}-pip-
    
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
        pip install pytest flake8 mypy black
    
    - name: Code formatting check
      run: black --check .
    
    - name: Lint with flake8
      run: |
        flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics
        flake8 . --count --exit-zero --max-complexity=10 --max-line-length=127 --statistics
    
    - name: Type checking with mypy
      run: mypy . --ignore-missing-imports
    
    - name: Test with pytest
      run: |
        pytest tests/ --cov=. --cov-report=xml --cov-report=html
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage.xml

  build:
    needs: test
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3
    
    - name: Login to Docker Hub
      uses: docker/login-action@v3
      with:
        username: ${{{{ secrets.DOCKER_USERNAME }}}}
        password: ${{{{ secrets.DOCKER_PASSWORD }}}}
    
    - name: Build and push Docker image
      uses: docker/build-push-action@v5
      with:
        context: .
        push: true
        tags: |
          ${{{{ env.DOCKER_IMAGE }}}}:latest
          ${{{{ env.DOCKER_IMAGE }}}}:${{{{ env.DOCKER_TAG }}}}
        cache-from: type=gha
        cache-to: type=gha,mode=max

  security-scan:
    needs: build
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Run Trivy vulnerability scanner
      uses: aquasecurity/trivy-action@master
      with:
        image-ref: '${{{{ env.DOCKER_IMAGE }}}}:${{{{ env.DOCKER_TAG }}}}'
        format: 'sarif'
        output: 'trivy-results.sarif'
    
    - name: Upload Trivy scan results to GitHub Security tab
      uses: github/codeql-action/upload-sarif@v2
      with:
        sarif_file: 'trivy-results.sarif'

  deploy:
    needs: [test, build, security-scan]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Deploy to staging
      run: |
        echo "Deploying to staging environment..."
        # Add deployment commands here
    
    - name: Run integration tests
      run: |
        echo "Running integration tests..."
        # Add integration test commands here
    
    - name: Deploy to production
      if: success()
      run: |
        echo "Deploying to production environment..."
        # Add production deployment commands here
"""
        
        return workflow
    
    def generate_gitlab_ci(self, config: Optional[CIConfig] = None) -> str:
        """สร้าง GitLab CI configuration"""
        gitlab_ci = """stages:
  - test
  - build
  - security
  - deploy

variables:
  DOCKER_IMAGE: object-detection-app
  DOCKER_TAG: $CI_COMMIT_SHA

before_script:
  - python --version
  - pip install --upgrade pip

test:
  stage: test
  image: python:3.9
  script:
    - pip install -r requirements.txt
    - pip install pytest flake8 mypy black
    - black --check .
    - flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics
    - mypy . --ignore-missing-imports
    - pytest tests/ --cov=. --cov-report=xml
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage.xml
  coverage: '/TOTAL.+ ([0-9]{1,3}%)/'

build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t $DOCKER_IMAGE:$DOCKER_TAG .
    - docker tag $DOCKER_IMAGE:$DOCKER_TAG $DOCKER_IMAGE:latest
    - docker push $DOCKER_IMAGE:$DOCKER_TAG
    - docker push $DOCKER_IMAGE:latest
  only:
    - main
    - develop

security_scan:
  stage: security
  image: aquasec/trivy:latest
  script:
    - trivy image --exit-code 0 --format template --template "@contrib/sarif.tpl" -o trivy-report.sarif $DOCKER_IMAGE:$DOCKER_TAG
    - trivy image --exit-code 1 --severity HIGH,CRITICAL $DOCKER_IMAGE:$DOCKER_TAG
  artifacts:
    reports:
      sast: trivy-report.sarif
  only:
    - main

deploy_staging:
  stage: deploy
  script:
    - echo "Deploying to staging..."
    # Add staging deployment commands
  environment:
    name: staging
    url: https://staging.example.com
  only:
    - develop

deploy_production:
  stage: deploy
  script:
    - echo "Deploying to production..."
    # Add production deployment commands
  environment:
    name: production
    url: https://production.example.com
  when: manual
  only:
    - main
"""
        
        return gitlab_ci
    
    def generate_jenkins_pipeline(self, config: Optional[CIConfig] = None) -> str:
        """สร้าง Jenkins pipeline"""
        jenkins_pipeline = """pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'object-detection-app'
        DOCKER_TAG = "${BUILD_NUMBER}"
        DOCKER_REGISTRY = 'your-registry.com'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Setup') {
            steps {
                sh 'python -m pip install --upgrade pip'
                sh 'pip install -r requirements.txt'
                sh 'pip install pytest flake8 mypy black'
            }
        }
        
        stage('Code Quality') {
            parallel {
                stage('Format Check') {
                    steps {
                        sh 'black --check .'
                    }
                }
                stage('Lint') {
                    steps {
                        sh 'flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics'
                    }
                }
                stage('Type Check') {
                    steps {
                        sh 'mypy . --ignore-missing-imports'
                    }
                }
            }
        }
        
        stage('Test') {
            steps {
                sh 'pytest tests/ --cov=. --cov-report=xml --junitxml=test-results.xml'
            }
            post {
                always {
                    junit 'test-results.xml'
                    publishCoverage adapters: [coberturaAdapter('coverage.xml')], sourceFileResolver: sourceFiles('STORE_LAST_BUILD')
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    def image = docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                    docker.withRegistry("https://${DOCKER_REGISTRY}", 'docker-registry-credentials') {
                        image.push()
                        image.push('latest')
                    }
                }
            }
        }
        
        stage('Security Scan') {
            steps {
                sh "trivy image --exit-code 1 --severity HIGH,CRITICAL ${DOCKER_IMAGE}:${DOCKER_TAG}"
            }
        }
        
        stage('Deploy to Staging') {
            when {
                branch 'develop'
            }
            steps {
                sh 'echo "Deploying to staging..."'
                // Add staging deployment commands
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                input message: 'Deploy to production?', ok: 'Deploy'
                sh 'echo "Deploying to production..."'
                // Add production deployment commands
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            emailext (
                subject: "Build Success: ${env.JOB_NAME} - ${env.BUILD_NUMBER}",
                body: "Build completed successfully.",
                to: "${env.CHANGE_AUTHOR_EMAIL}"
            )
        }
        failure {
            emailext (
                subject: "Build Failed: ${env.JOB_NAME} - ${env.BUILD_NUMBER}",
                body: "Build failed. Please check the logs.",
                to: "${env.CHANGE_AUTHOR_EMAIL}"
            )
        }
    }
}
"""
        
        return jenkins_pipeline
    
    def create_ci_files(self, platform: str = "github"):
        """สร้างไฟล์ CI/CD"""
        try:
            if platform == "github":
                # สร้าง GitHub Actions workflow
                workflow_dir = self.project_root / ".github" / "workflows"
                workflow_dir.mkdir(parents=True, exist_ok=True)
                
                workflow_content = self.generate_github_workflow()
                with open(workflow_dir / "ci-cd.yml", 'w') as f:
                    f.write(workflow_content)
                
                self.logger.info("GitHub Actions workflow created")
                
            elif platform == "gitlab":
                # สร้าง GitLab CI configuration
                gitlab_ci_content = self.generate_gitlab_ci()
                with open(self.project_root / ".gitlab-ci.yml", 'w') as f:
                    f.write(gitlab_ci_content)
                
                self.logger.info("GitLab CI configuration created")
                
            elif platform == "jenkins":
                # สร้าง Jenkins pipeline
                jenkins_pipeline_content = self.generate_jenkins_pipeline()
                with open(self.project_root / "Jenkinsfile", 'w') as f:
                    f.write(jenkins_pipeline_content)
                
                self.logger.info("Jenkins pipeline created")
            
        except Exception as e:
            self.logger.error(f"Error creating CI files: {e}")
            raise

# ========================================
# Main Function สำหรับทดสอบ
# ========================================

if __name__ == "__main__":
    # สร้าง Docker manager
    docker_manager = DockerManager()
    
    # สร้าง CI pipeline manager
    ci_manager = CIPipelineManager()
    
    try:
        print("Creating Docker files...")
        docker_manager.create_docker_files()
        
        print("Creating CI/CD files...")
        ci_manager.create_ci_files("github")
        
        print("Setup completed successfully!")
        
        # ถ้ามี Docker ให้ build image
        if docker_manager.docker_client:
            print("Building Docker image...")
            if docker_manager.build_image():
                print("Docker image built successfully!")
            else:
                print("Failed to build Docker image")
        
    except Exception as e:
        print(f"Error during setup: {e}")