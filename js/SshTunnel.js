const socks = require('socksv5');
const { Client } = require('ssh2');
const config = require('./config');
const { exec } = require('child_process');

class sshTunnel {
    static ssh() {
        return new Promise((resolve, reject) => {
            socks.createServer((info, accept, deny) => {
                const conn = new Client();
                conn.on('ready', () => {
                    conn.forwardOut(
                        info.srcAddr,
                        info.srcPort,
                        info.dstAddr,
                        info.dstPort,
                        (err, stream) => {
                            if (err) {
                                conn.end();
                                deny();
                                reject(err);
                            } else {
                                const clientSocket = accept(true);
                                if (clientSocket) {
                                    stream
                                        .pipe(clientSocket)
                                        .pipe(stream)
                                        .on('close', () => {
                                            conn.end();
                                            resolve(1);
                                        });
                                } else {
                                    conn.end();
                                    resolve(1);
                                }
                            }
                        }
                    );
                }).on('error', (err) => {
                    deny();
                    reject(err);
                }).connect(config.sshConfig);
            }).listen(config.localProxy.port, config.localProxy.host, () => {
                console.log(
                    'SOCKSv5 proxy server started on port ',
                    config.localProxy.host,
                    ':',
                    config.localProxy.port
                );
                resolve(0);
            }).useAuth(socks.auth.None());
        });
    }

    static closeconnection() {
        conn.end();
        console.log('SOCKSv5 proxy server closed');
    }

    static async TestingConnection() {
        return new Promise((resolve, reject) => {
            exec(
                'curl -x socks5://localhost:1090 -I https://www.example.com',
                (error, stdout, stderr) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(stdout);
                    }
                }
            );
        });
    }

    static async testConnection() {
        try {
            await this.TestingConnection();
            return 0;
        } catch (error) {
            return 1;
        }
    }
}

module.exports = { sshTunnel };