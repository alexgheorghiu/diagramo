import smtpd
import asyncore
import email
from time import time
from math import floor

class DumpServer (smtpd.SMTPServer):
			
	def process_message(self, peer, mailfrom, rcpttos, data):
		print 'Receiving message from:', peer
		print 'Message addressed from:', mailfrom
		print 'Message addressed to  :', rcpttos
		print 'Message length        :', len(data)
		print 'Date			   :', data
		
		msg = email.message_from_string(data)
		
		#open file
		file = str(int(floor(time())))  + '_email_dump.html'
		f = open( file,'w')
		f.write('<html><body>')
		f.write('From: ' + msg['From'] + "<br>\n")
		f.write('To: ' + msg['To'] + "<br>\n")
		f.write('Subject: ' + msg['Subject'] + "<br>\n")
		
		#print 'Content type: ', msg.get_content_type()
		if msg.is_multipart():
			#no implemented
			pass
		else:
			body = msg.get_payload()	
			f.write(body)	
		#email.iterators._structure(msg)		
		f.write('</body></html>')
		f.close()
		return

srv = DumpServer(('localhost', 25), None)
asyncore.loop()

	
