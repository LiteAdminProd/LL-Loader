const axios = require('axios');
const fs = require('fs');
const AdmZip = require("adm-zip");
const { spawn } = require("child_process");
var readlineSync = require("readline-sync");

const blue = '\u001b[34m'
const white = '\u001b[0m'
//const cyan = '\u001b[36;1m'
const cyan =  '\u001b[36m'
const red = '\u001b[31m'

const ver = '1.0.0'


console.log(cyan)
console.log(" _     _          _                    _              ")   
console.log("| |   | |        | |    ___   __ _  __| | ___ _ __   ")  
console.log("| |   | |   _____| |   / _ \\ / _` |/ _` |/ _ \\ '__|")  
console.log("| |___| |__|_____| |__| (_) | (_| | (_| |  __/ |     ")  
console.log("|_____|_____|    |_____\\___/ \\__,_|\\__,_|\\___|_| ")
console.log(cyan + 'INFO' + white + " Version: " + ver)
console.log(cyan + 'INFO' + white + " Made by prorok, js & LiteLoader community")
console.log(cyan + 'INFO' + white + " Made with love to bedrock community")
console.log(white)

let BDS
let LL_link
let LL

//config
let server_name 
let gamemode 
let difficulty 
let allow_cheats 
let max_players 
let server_port 
let level_name 
let level_seed

function setconf(){
    file = fs.readFile('./LiteLoader-' + BDS + '/server.properties', 'utf8', function (err,data) {
        let config = data.replace('server-name=Dedicated Server', 'server-name=' + server_name);
        config = config.replace('gamemode=survival','gamemode=' + gamemode)
        config = config.replace('difficulty=easy','difficulty=' + difficulty)
        config = config.replace('allow-cheats=false','allow-cheats=' + allow_cheats)
        config = config.replace('max-players=10','max-players=' + max_players)
        config = config.replace('server-port=19132','server-port=' + server_port)
        config = config.replace('level-name=Bedrock level','level-name=' + level_name)
        config = config.replace('level-seed=','level-seed' + level_seed)
        fs.writeFile('./LiteLoader-' + BDS + '/server.properties', config, 'utf8', function (err) {
            if (err) return console.log(err);
            console.log(cyan + 'INFO' + white + ' Done! Now you can start your server (./LiteLoader-' + BDS + '/bedrock_server_mod.exe)')
            console.log(cyan + 'INFO' + white + ' Thanks for using LLL')
            console.log(cyan + 'INFO' + white + ' GitHub: https://github.com/LiteAdminProd/LL-Loader')
            console.log(cyan + 'INFO' + white + ' Discord: prorok#1433')
            console.log(cyan + 'INFO' + white + ' Telegram: https://t.me/Prorok_ilon')
        });
    });
}

function config(){
    server_name = readlineSync.question(cyan + 'INFO' + white + ' server_name(motd) > ');
    gamemode = readlineSync.question(cyan + 'INFO' + white + ' gamemode(survival/creative/adventure) > ');
    difficulty = readlineSync.question(cyan + 'INFO' + white + ' difficulty(peaceful/easy/normal/hard) > ');
    allow_cheats = readlineSync.question(cyan + 'INFO' + white + ' allow_cheats(true/false) > ');
    max_players = readlineSync.question(cyan + 'INFO' + white + ' max_players > ');
    server_port = readlineSync.question(cyan + 'INFO' + white + ' server_port > ');
    level_name = readlineSync.question(cyan + 'INFO' + white + ' level_name > ');
    level_seed = readlineSync.question(cyan + 'INFO' + white + ' level_seed(none if random seed) > ')
    download_bds()

}

function gen(){
    if(parseInt(LL.split('.')[0]) >= 2 && parseInt(LL.split('.')[1]) >= 2){

        console.log(cyan + 'INFO' + white + ' Generating bedrock_server_mod...')
        const bat = spawn('cmd.exe', ['/c', 'cd .\\LiteLoader-' + BDS + '&& LLPeEditor.exe']);

        interval = setInterval(() => {
            bat.stdin.write('\n')
        }, 2000);

        bat.on('exit', (code) => {
            if(code != 0){
                console.log(red + 'FATAL' + ' Failed generate bedrock_server_mod ')
                process.exit(1)
            }
            else{
                clearInterval(interval)
                console.log(cyan + 'INFO' + white + ' Successfully generated bedrock_server_mod')
                setconf()
            }   

        });  

    }
    else{
        console.log(cyan + 'INFO' + white + ' Generating bedrock_server_mod...')
        const bat = spawn('cmd.exe', ['/c',  'cd .\\LiteLoader-' + BDS + '&& SymDB2.exe']);

        interval = setInterval(() => {
            bat.stdin.write('\n')
        }, 2000);

        bat.on('exit', (code) => {
            if(code != 0){
                console.log(red + 'FATAL' + ' Failed generate bedrock_server_mod ')
                process.exit(1)
            }
            else{
                clearInterval(interval)
                console.log(cyan + 'INFO' + white + ' Successfully generated bedrock_server_mod')
                setconf()
            }   

        });  

    }
}

function unzip(){

    console.log(cyan + 'INFO' + white + ' Start unziping BDS...')
    let bds = new AdmZip('./LiteLoader-' + BDS + '/Bedrock_Server.zip');
    bds.extractAllTo(/*target path*/ './LiteLoader-' + BDS, /*overwrite*/ true);

    console.log(cyan + 'INFO' + white + ' Successfully unzipped BDS')

    console.log(cyan + 'INFO' + white + ' Start unziping LL...')
    let ll = new AdmZip('LiteLoader-' + BDS + '/LiteLoader.zip');
    ll.extractAllTo(/*target path*/ './LiteLoader-' + BDS, /*overwrite*/ true);
    console.log(cyan + 'INFO' + white + ' Successfully unzipped LL')

    console.log(cyan + 'INFO' + white + ' Start deleting BDS...')
    fs.unlink('./LiteLoader-' + BDS + '/Bedrock_Server.zip',err => {
        if(err){
            console.log(red + 'FATAL' + ' Failed remove BDS')
            process.exit(1)
        } 
        else console.log(cyan + 'INFO' + white + ' Successfully deleted BDS')
        gen()
    })
    

    console.log(cyan + 'INFO' + white + ' Start deleting LL...')

    fs.unlink('LiteLoader-' + BDS + '/LiteLoader.zip',err => {
        if(err){
            console.log(red + 'FATAL' + ' Failed remove LiteLoader')
            process.exit(1)
        } 
        else console.log(cyan + 'INFO' + white + ' Successfully deleted LL')
    })
    
}

async function download_ll(){
    console.log(cyan + 'INFO' + white + ' Start downloading LL...')
    await axios({
        method: 'get',
        url: LL_link,
        responseType: 'stream'
    })
    .then(async function (response) {
        await response.data.pipe(fs.createWriteStream('LiteLoader-' + BDS + '/LiteLoader.zip')).on("finish", function(){
            console.log(cyan + 'INFO' + white + ' Successfully downloaded LiteLoader')
            unzip()
        });
    })
    .catch(error => {
        console.error(error);
    });
}

async function download_bds(){
    console.log(cyan + 'INFO' + white + ' Creating dirictory of server...')
    fs.mkdir('LiteLoader-' + BDS, err => {})
    console.log(cyan + 'INFO' + white + ' Start downloading BDS...')
    await axios({
        method: 'get',
        url: 'https://minecraft.azureedge.net/bin-win/bedrock-server-' + BDS + '.zip',
        responseType: 'stream'
    })
    .then(async function (response) {
        await response.data.pipe(fs.createWriteStream('LiteLoader-' + BDS + '/Bedrock_Server.zip')).on("finish", function(){
            console.log(cyan + 'INFO' + white + ' Successfully downloaded BDS')
            download_ll()
        });
        
    })
    .catch(error => {
        console.error(error);
    });
}

function bds(){
    console.log(cyan + 'INFO' + white + ' Getting all BDS versions...')
    axios.get('https://raw.githubusercontent.com/StarsDream00/BDSVersions/main/bds_ver_win.json').then(res => {
        res = JSON.parse(JSON.stringify(res.data))
        let string = ''
        for(let i = 0; i < res.length; i++){
            if(res.length - i == 1){
                string += res[i] + '.'
            }
            else{
                string += res[i]+ ', '
            }
        }
        //bds
        console.log(cyan + 'INFO' + white + ' It is all BDS versions:')
        console.log(string)
        console.log(cyan + 'INFO' + white + ' Choose one from it and send')
        nice = false
        BDS = readlineSync.question(cyan + 'INFO' + white + ' version > ') 
        for(let i = 0; i < res.length; i++){
            if(BDS == res[i]){
                console.log(cyan + 'INFO' + white + ' You choose ' + BDS + ' version')
                nice = true
                config()
            }
        }
        if(nice == false){
            console.log('Invalid version')
        }
    })
    .catch(error => {
        console.error(error);
    });
}

function main(){
    console.log(cyan + 'INFO' + white + ' Getting all LiteLoader versions...')
    axios.get('https://api.github.com/repos/LiteLDev/LiteLoaderBDS/releases').then(res => {
    res = JSON.parse(JSON.stringify(res.data))
        // console.log(res[2]['assets'][0]['browser_download_url'])
        let string = ''
        for(let i = 0; i < res.length; i++){
            if(res.length - i == 1){
                string += res[i]['tag_name'] + '.'
            }
            else{
                string += res[i]['tag_name'] + ', '
            }
            
        }
        console.log(cyan + 'INFO' + white + ' It is all LiteLoader versions:')
        console.log(string)
        console.log(cyan + 'INFO' + white + ' Choose one from it and send')

        nice = false
        LL = readlineSync.question(cyan + 'INFO' + white + ' version > ')
            
        for(let i = 0; i < res.length; i++){
            if(LL == res[i]['tag_name']){
                console.log(cyan + 'INFO' + white + ' You choose ' + LL + ' version')
                nice = true
                LL_link = res[i]['assets'][0]['browser_download_url']
                LL = res[i]['tag_name']
                bds()
            }
        }
        if(nice == false){
            console.log('Invalid version')
        }
    })
    .catch(error => {
        console.error(error);
    });

}

main()