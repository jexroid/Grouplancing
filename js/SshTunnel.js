const socks = require('socksv5');
const { Client } = require('ssh2');

const sshConfig = {
    host: '51.222.112.51',
    port: 2703,
    username: 'amirrezafarzan',
    password: 'bt9e7m#zHw7T'
};



class sshTunnel {
    static ssh() {
        socks.createServer((info, accept, deny) => {
            // NOTE: you could just use one ssh2 client connection for all forwards, but
            // you could run into server-imposed limits if you have too many forwards open
            // at any given time
            const conn = new Client();
            conn.on('ready', () => {
                conn.forwardOut(info.srcAddr,
                    info.srcPort,
                    info.dstAddr,
                    info.dstPort,
                    (err, stream) => {
                        if (err) {
                            conn.end();
                            return deny();
                        }

                        const clientSocket = accept(true);
                        if (clientSocket) {
                            stream.pipe(clientSocket).pipe(stream).on('close', () => {
                                conn.end();
                            });
                        } else {
                            conn.end();
                        }
                    });
            }).on('error', (err) => {
                deny();
            }).connect(sshConfig);
        }).listen(1080, '127.0.0.1', () => {
            console.log('SOCKSv5 proxy server started on port 127.0.0.1:1080');
        }).useAuth(socks.auth.None());
    }
}


module.exports = { sshTunnel };