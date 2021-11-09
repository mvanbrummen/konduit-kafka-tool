# Konduit - Kafka Management Tool

Kafka management tool using Electron framework.

![screenshot.png](images/screenshot.png 'Screen shot')

# Getting Started

## Starting Development

Start local kafka instance

```bash
docker-compose up -d
```

Start the app in the `dev` environment:

```bash
yarn start
```

## Packaging for Production

To package apps for the local platform:

```bash
yarn package
```

# TODO

- Schemas
- Fix topic consume
- Refactor IPC messaging
- Error handling
- Add tests
