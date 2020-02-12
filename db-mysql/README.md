
# db-mysql

[db-mysql](https://github.com/happycloudpak/helm-charts/tree/master/stable)
bbs앱의 저장소를 위한 mysql chart입니다.

## Introduction

mysql container를 생성합니다.

## Prerequisites

- Kubernetes 1.8+

## Installing the Chart

To install the chart with the release name `my-release`:

```bash
$ $ helm install <git repository>/db-mysql --name my-release

```

The command deploys this chart on the Kubernetes cluster in the default configuration. The [configuration](#configuration) section lists the parameters that can be configured during installation.

> **Tip**: List all releases using `helm list`

## Uninstalling the Chart

To uninstall/delete the `my-release` deployment:

```bash
$ helm delete my-release
```

The command removes all the Kubernetes components associated with the chart and deletes the release.

## Configuration

The following table lists the configurable parameters of the chart and their default values.

| Parameter                | Description                             | Default              |
|--------------------------|-----------------------------------------|----------------------|
| `image.registry`         | Image registry                          | `docker.io`          |
| `image.repository`       | Image name                              | `mysql`              |
| `image.tag`              | Image tag                               | `5.7`                |
| `image.pullPolicy`       | Image pull policy                       | `IfNotPresent`       |
| `containerPort.port`     | container port                          | `3306`               |
| `containerPort.nodePort` | container export port                   | `30000`              |
| `volume.server`          | nfs server IP                           | `169.56.164.243`     |
| `volume.path`            | nfs server volume path                  | `/data/nfs/bbs-mysql`|

Specify each parameter using the `--set key=value[,key=value]` argument to `helm install`. For example,

Alternatively, a YAML file that specifies the values for the parameters can be provided while installing the chart. For example,

```bash
$ helm install --name my-release -f values.yaml <repo>/<db-mysql>
```

```

> **Tip**: You can use the default [values.yaml](values.yaml)

