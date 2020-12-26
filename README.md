# PWA for controlling rgb leds

Node 11.x
`npm install -g ionic`
## Deploy
`nvm use 11 && yarn build && yarn deploy`
Access app
http://raspberrypi.local:8100/#/home
http://raspberrypi.local:8000/admin

### Backend
``` bash
sudo nmap -sS -p22 10.0.0.1/24 | grep -B 6 Raspberry

ssh pi@raspberrypi.local
sudo supervisorctl
supervisor> restart django
```


## Install
``` bash
pipenv install --system
```
