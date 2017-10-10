# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = '2'

@privileged = <<-SHELL
   echo ************* Update Yum and install yum-utils *************
   yum update
   yum install -y yum-utils

   echo ************* Install Apache / Httpd ************* 
   yum install -y httpd
   systemctl start httpd

   echo ************* Install git ************* 
   yum install -y git

   echo ************* Clean up ************* 
   yum clean all
SHELL

Vagrant.configure("2") do |config|

  config.vm.box = "bento/centos-7.4"
  config.vm.network "forwarded_port", guest: 80, host: 8081, host_ip: "127.0.0.1"
  config.vm.network "public_network"
  config.vm.synced_folder '.', '/var/www/html/'    

  config.vm.provision "shell", inline: @privileged
end


