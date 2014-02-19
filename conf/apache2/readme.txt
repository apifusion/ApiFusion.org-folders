1. Enable rewrite module
# cd /etc/apache2/mods-enabled
# ln -s ../mods-available/rewrite.load rewrite.load
2. Add ApiFusion web folder
# cd /etc/apache2/conf.d
# ln -s /home/developer/git/conf/apache2/ApiFusion.conf ApiFusion.conf
# service apache2 restart
