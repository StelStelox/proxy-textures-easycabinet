# proxy-textures-easycabinet
API rest для упрощённого построения путей до скинов и плащей AuroraTeam/EasyCabinet

**Требования: node js не меньше 20 версии**
### Начало работы

1. Установите пакеты из npm менеджера
    ```
    npm i
    ```
2. Отредактируйте ``.env``
    ```
    HOSTNAME="127.0.0.1" # Адрес который слушает API REST приложение
    PORT=3000 # Порт который слушает API REST приложение
    DATABASE_URL="mysql://root:password@localhost:3306/db"
    STORAGE="backend" # Выбор хранения текстур может быть backend или s3
    URL_BACKEND_EASY_CABINET="http://localhost:4000/" # Адрес backend EasyCabinet
    S3_PUBLIC_URL="http://localhost:9000" # Адрес S3 хранилища
    S3_BUCKET="easy-cabinet" # Имя хранилища
    ```
3. Сгенерируйте prisma схему
    ```
    npx prisma generate
    ```
4. Запустите
    ```
    npm run start
    ```