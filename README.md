# proxy-textures-easycabinet
API rest для упрощённого построения путей до скинов и плащей AuroraTeam/EasyCabinet

### Начало работы

1. Выдайте права на исполнение
    ```
    chmod +x proxy-textures-easycabinet
    ```
2. Запустите чтобы сгенерировать конфигурацию
   ```
   ./proxy-textures-easycabinet
   ```
3. Отредактируйте ``config.json``
    ```
    hostname="127.0.0.1" # Адрес который слушает API REST приложение
    port=3000 # Порт который слушает API REST приложение
    database_url="mysql://root:password@localhost:3306/db" # База данных
    storage="backend" # Выбор хранения текстур может быть backend или s3
    backend_url="http://localhost:4000/" # Адрес backend EasyCabinet
    s3_url="http://localhost:9000" # Адрес S3 хранилища
    s3_bucket="easy-cabinet" # Имя хранилища
    ```
4. Запустите
    ```
    ./proxy-textures-easycabinet
    ```