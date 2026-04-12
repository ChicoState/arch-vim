# arch-vim


## Docker commands

### Might need to run
```
docker compose exec -it django-backend python manage.py makemigrations
docker compose exec -it django-backend python manage.py migrate
```

### Building after changes:
```
docker compose build --no-cache
docker compose up
```

### SQLite file
<br> The SQLite file is in `.gitignore`, so after running the previous command, run
```
docker compose exec backend manage.py migrate
```
<br> Once we start making level, we can store level data in a json file, like `/backend/fixtures/levels.json`
```
docker compose exec backend python manage.py loaddata fixtures/levels.json
```

### Starting after being built
```
docker compose up
```

### Shutting down
```
docker compose down
```



## React frontend once running [here](http://localhost:3000/):
```
http://localhost:3000/
```

## Django backend once running [here](http://localhost:8000/):
```
http://localhost:8000/
```

