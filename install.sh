sudo apt update
sudo apt upgrade -y
sudo apt autoremove -y

pip3 install -U pip setuptools pipenv wheel
sudo apt-get install htop python3-numpy python3-yarl -y

curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh

