# CodeCollab Kubernetes Infrastructure

Complete Kubernetes deployment for CodeCollab platform with production-grade features.

## Architecture
```
Internet → Traefik (Docker) → NodePort → K8s Services → Pods
                                            ↓
                                      PostgreSQL (External)
```

### Components

- **Control Plane**: K3s lightweight Kubernetes
- **Services**: 4 microservices (Session, Execution, Collaboration, Frontend)
- **Replicas**: 2 per service (HA)
- **Database**: External PostgreSQL (Docker)
- **Ingress**: Hybrid - Docker Traefik routing to K8s NodePorts
- **Monitoring**: Prometheus + Grafana

## Quick Start

### Deploy Everything
```bash
cd infrastructure/k8s
./scripts/deploy.sh
```

### Install Monitoring (Optional)
```bash
cd monitoring
./install-prometheus.sh
```

## Directory Structure
```
infrastructure/k8s/
├── base/                          # Core manifests
│   ├── namespace.yaml            # codecollab namespace
│   ├── configmap.yaml            # Environment config
│   ├── secret.yaml               # Database credentials
│   ├── postgres-external.yaml    # External DB service
│   ├── session-service.yaml      # Session service deployment
│   ├── execution-service.yaml    # Execution service deployment
│   ├── collaboration-service.yaml # Collaboration service deployment
│   ├── frontend.yaml             # Frontend deployment
│   ├── services-nodeport.yaml    # NodePort services
│   ├── hpa-*.yaml                # Horizontal Pod Autoscalers
│   ├── pdb-*.yaml                # Pod Disruption Budgets
│   ├── resourcequota.yaml        # Namespace resource limits
│   └── limitrange.yaml           # Default resource limits
├── scripts/
│   ├── deploy.sh                 # Main deployment script
│   └── cleanup.sh                # Cleanup script
└── monitoring/
    ├── install-prometheus.sh     # Install monitoring stack
    └── README.md                 # Monitoring docs
```

## Features

### 1. High Availability

- **Replicas**: 2 per service
- **Pod Disruption Budgets**: Ensures 1 pod always available
- **Readiness/Liveness Probes**: Automatic health checking
- **Rolling Updates**: Zero-downtime deployments

### 2. Auto-Scaling (HPA)

- **CPU-based**: Scales when >70% CPU utilization
- **Memory-based**: Scales when >80% memory utilization
- **Min replicas**: 2 (always HA)
- **Max replicas**: 10-20 (cost control)

Trigger scaling:
```bash
kubectl run load --rm -it --image=busybox --restart=Never -n codecollab -- \
  /bin/sh -c "while true; do wget -q -O- http://session-service:8001/health; done"
```

Watch scaling:
```bash
kubectl get hpa -n codecollab -w
```

### 3. Resource Management

**Namespace Quotas**:
- CPU requests: 4 cores
- Memory requests: 8Gi
- CPU limits: 8 cores
- Memory limits: 16Gi

**Default Container Limits**:
- CPU: 100m request, 500m limit
- Memory: 128Mi request, 512Mi limit

### 4. External Database Integration

PostgreSQL runs in Docker, K8s connects via External Service pattern:
```yaml
apiVersion: v1
kind: Service
metadata:
  name: postgres
spec:
  clusterIP: None  # Headless service
---
apiVersion: v1
kind: Endpoints
metadata:
  name: postgres
subsets:
- addresses:
  - ip: <VPS_IP>  # Host network IP
  ports:
  - port: 5432
```

Pods connect to `postgres:5432` - K8s DNS resolves to external IP.

### 5. Hybrid Networking

**Why NodePort + Docker Traefik?**

- Existing Traefik on ports 80/443 (other apps depend on it)
- K3s Traefik would conflict
- Solution: K8s services as NodePort, Docker Traefik routes to them

**NodePort Mapping**:
- Frontend: 30080
- Session Service: 30001
- Execution Service: 30002
- Collaboration Service: 30003

### 6. Monitoring Stack

Prometheus + Grafana for observability:
```bash
# Install
cd monitoring
./install-prometheus.sh

# Access Grafana
kubectl port-forward -n monitoring svc/grafana 3000:3000
# Login: admin / <get password from secret>

# Access Prometheus
kubectl port-forward -n monitoring svc/prometheus-k8s 9090:9090
```

## Common Operations

### View Resources
```bash
# All resources
kubectl get all -n codecollab

# Specific types
kubectl get pods -n codecollab
kubectl get svc -n codecollab
kubectl get hpa -n codecollab
kubectl get pdb -n codecollab

# Resource usage
kubectl top nodes
kubectl top pods -n codecollab

# Quota usage
kubectl describe resourcequota -n codecollab
```

### View Logs
```bash
# Deployment logs
kubectl logs -f deployment/session-service -n codecollab

# Specific pod
kubectl logs -f pod/<pod-name> -n codecollab

# Previous crashed container
kubectl logs <pod-name> -n codecollab --previous
```

### Debug
```bash
# Describe pod (shows events)
kubectl describe pod <pod-name> -n codecollab

# Execute into pod
kubectl exec -it deployment/session-service -n codecollab -- sh

# Port forward for local testing
kubectl port-forward service/session-service 8001:8001 -n codecollab

# Run debug pod
kubectl run debug --rm -it --image=busybox --restart=Never -n codecollab -- sh
```

### Scale Manually
```bash
# Scale up
kubectl scale deployment/session-service --replicas=5 -n codecollab

# Scale down
kubectl scale deployment/session-service --replicas=2 -n codecollab

# Note: HPA will override manual scaling
```

### Update Image
```bash
# Update deployment image
kubectl set image deployment/session-service \
  session-service=ghcr.io/alchemistkay/codecollab/session-service:v2 \
  -n codecollab

# Watch rollout
kubectl rollout status deployment/session-service -n codecollab

# Rollback if needed
kubectl rollout undo deployment/session-service -n codecollab
```

### Restart Deployment
```bash
kubectl rollout restart deployment/session-service -n codecollab
```

## Troubleshooting

### ImagePullBackOff

**Cause**: Can't pull container image

**Check**:
```bash
kubectl describe pod <pod-name> -n codecollab
# Look at Events section
```

**Fix**: Import images into K3s
```bash
docker save <image-name> | sudo k3s ctr images import -
```

### CrashLoopBackOff

**Cause**: Container starts then crashes repeatedly

**Check**:
```bash
kubectl logs <pod-name> -n codecollab --previous
kubectl describe pod <pod-name> -n codecollab
```

**Common causes**:
- Database connection failed
- Missing environment variables
- Application bug
- Resource limits too low

### Service Not Routing

**Check**:
```bash
# Service has endpoints?
kubectl get endpoints <service-name> -n codecollab

# Labels match?
kubectl get service <service-name> -n codecollab -o yaml | grep -A 5 selector
kubectl get pods -n codecollab --show-labels

# Pod ready?
kubectl get pods -n codecollab
# READY should show 1/1, not 0/1
```

### HPA Not Scaling

**Check**:
```bash
# Metrics available?
kubectl top nodes
kubectl top pods -n codecollab

# HPA status
kubectl describe hpa <hpa-name> -n codecollab

# Events
kubectl get events -n codecollab --sort-by='.lastTimestamp'
```

**Fix**: Ensure metrics-server is running
```bash
kubectl get pods -n kube-system | grep metrics-server
```

## Production Checklist

- [x] Multiple replicas for HA
- [x] Resource requests/limits defined
- [x] Readiness/liveness probes configured
- [x] Pod Disruption Budgets set
- [x] Horizontal Pod Autoscaler configured
- [x] Resource quotas at namespace level
- [x] Monitoring stack available
- [ ] Network Policies (security isolation)
- [ ] TLS within cluster (service mesh)
- [ ] Backup strategy for etcd
- [ ] Disaster recovery plan
- [ ] Log aggregation (ELK/Loki)
- [ ] Distributed tracing (Jaeger)
- [ ] GitOps (ArgoCD)

## Talking Points

### Why Kubernetes?

"We migrated to Kubernetes to achieve:
- **Auto-scaling**: Handle traffic spikes automatically
- **Self-healing**: Pods restart on failure
- **Zero-downtime deployments**: Rolling updates
- **Resource efficiency**: Better utilization vs VMs
- **Declarative infrastructure**: YAML in Git"

### Why Hybrid Architecture?

"We used a hybrid approach because:
- **Existing infrastructure**: Had production Traefik + PostgreSQL
- **Risk mitigation**: Didn't move everything at once
- **Zero downtime**: Incremental migration
- **Cost**: Reused existing SSL certs and monitoring

This is common in enterprises - brownfield deployments where you integrate K8s into existing infrastructure."

### Why External Database?

"We kept PostgreSQL external because:
- **Separation of concerns**: Stateful vs stateless
- **Team expertise**: DBA team managed PostgreSQL
- **Risk**: Database migration riskier than app migration
- **Pattern**: Mirrors production (AWS RDS, GCP Cloud SQL)

Used K8s External Service with manual Endpoints - same pattern works for any external service."

### HPA Strategy

"We implemented HPA with:
- **CPU-based scaling**: >70% triggers scale-up
- **Stabilization windows**: Prevent flapping
- **Min/max bounds**: Cost control
- **Fast scale-up, slow scale-down**: Handle spikes, avoid oscillation

In production, we'd add custom metrics (request rate, queue depth) via Prometheus adapter."

## Next Steps

**Phase 3: Advanced Features**
- [ ] Network Policies for security
- [ ] Service Mesh (Istio/Linkerd)
- [ ] GitOps with ArgoCD
- [ ] Multi-cluster setup
- [ ] Disaster recovery procedures

**Production Hardening**
- [ ] TLS between services
- [ ] Pod Security Standards
- [ ] OPA policy enforcement
- [ ] Regular security scanning
- [ ] Chaos engineering tests

## Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [K3s Documentation](https://docs.k3s.io/)
- [Prometheus Operator](https://github.com/prometheus-operator/prometheus-operator)
- [Horizontal Pod Autoscaler](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)
- [External Service Pattern](https://kubernetes.io/docs/concepts/services-networking/service/#services-without-selectors)

