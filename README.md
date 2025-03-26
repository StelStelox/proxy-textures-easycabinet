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
    DATABASE_URL="mysql://root:password@localhost:3306/db" # Адрес базы данных

    PORT=3000 # Порт API приложения
    S3_BUCKET="easy-cabinet" # Имя хранилища
    S3_PUBLIC_URL="http://0.0.0.0:9000" # Адрес хранилища
    ```
3. Сгенерируйте prisma схему
    ```
    npx prisma generate
    ```
4. Запустите
    ```
    node index.js
    ```