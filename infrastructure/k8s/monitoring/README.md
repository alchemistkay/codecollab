# Monitoring Stack

Prometheus and Grafana for CodeCollab monitoring.

## Installation
```bash
./install-prometheus.sh
```

## Access

### Grafana
```bash
# Port forward
kubectl port-forward -n monitoring svc/grafana 3000:3000

# Get password
kubectl get secret grafana -n monitoring -o jsonpath='{.data.admin-password}' | base64 -d

# Open http://localhost:3000
# Login: admin / <password>
```

### Prometheus
```bash
kubectl port-forward -n monitoring svc/prometheus-k8s 9090:9090
# Open http://localhost:9090
```

## Uninstall
```bash
kubectl delete namespace monitoring
```
