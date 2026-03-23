#!/bin/bash

echo "Cleaning up CodeCollab from Kubernetes..."

kubectl delete namespace codecollab

echo ""
echo "CodeCollab removed from Kubernetes."
