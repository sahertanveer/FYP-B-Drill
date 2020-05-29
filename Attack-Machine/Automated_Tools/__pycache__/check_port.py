import socket
def isFree(ip,port):
   s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
   try:
      s.connect((ip, int(port)))
      s.shutdown(2)
      return False
   except:
      return True


print(isFree('192.168.10.61', 4444))