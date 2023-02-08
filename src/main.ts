import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  console.log("Listening port 3000");
} 
bootstrap();

// Predavanje 39.
// kreiranje Nest aplikacije : cmd => nest new <ime aplikacije>
// pokretanje aplikacije, imamo sve u package.json  fajlu i to u odeljku script{}, sa tim samo pozovemo: npm run <naziv indexa iz skripte(start:dev npr.)>

// .gitignore -> ovo je dir koji sadrzi podatke koji su sve moduli i podaci koji se ne prate


// za rad sa git-om, inicijalizujemo ga
// cmd> git init
// sa komandom git add . 
// ako hocemo da jedan branch spojimo sa drugim moramo da budemo u taj branch kom hocemo da dodamo taj drugi u koji smo radili promjene
// u git repository-umu dodajemo sve iz trenutnog root dira (C:\Users\Korisnik\Nest\aplikacija(root)\)
// ali jos nisu predati (commit-ovani), vec su prebaceni u master grani( cmd> git status)

// uz poruku ih komitujemo (u imperativu)
// cmd> git commit -m "<imperativna poruka>"

//cmd> git config --global user.email "sosicslavko8@gmail.com"
//cmd> git config --global user.name "Slavko Sosic"

// pregled svih commit-a
// cmd> git log
//--------------------------------------------------------------------------------------------------------------
//pravimo granu (branch), a prvo se vec nalazimo u branch master, sve promjene koje smo commit-ovail
//u jednom branch-u, nece biti i u onom koji je prije nje...
//cmd> git branch  <ime grane>

//pregled dostupnih grana
//cmd> git branch -l

// prelazak iz trenutnog u sledeci branch
//cmd> git checkout <ime branch-a koji hocemo da posjetimo>
//--------------------------------------------------------------------------------------------------------------
// za instalaciju paketa za povezivanje sa mysql, sa paketom typorm
//npm i mysql typeorm @nestjs/typeorm
/**da bi podesi konekcija, moramo u HeidSQL query => ALTER USER 'USERNAME'@'localhost' 
 *                                                   IDENTIFIED WITH mysql_native_password
 *                                                   BY 'password';
 *                                                    
 *                                                   FLUSH PRIVILEGES;
 * 
 * 
 * 
 * 

 * kada napavimo entitete iz baza u novom folderu entities, generisemo u cmd servis i smjestamo ga u folder  koja ce nam omoguciti
 * da radimo sa tim entitetima:
 * cmd> nest generate service <administrator-ime service> <ime foldera koji ce se napraviti i u kojem ce se sacuvati servis>
 *  
 * @Predavanje 40
 * 
 * instaliramo  generator koji ce nam sluziti za analizu i generisanje entiteta iz baze
 * cmd> npm i -g typeorm-model-generator
 * cmd>  typeorm-model-generator -h localhost -e mysql -p 3306 -u aplikacija -x aplikacija -d aplikacija
 * 
 * @Predavanje 43
 * 
 *CRUD - omogucava automacku implementaciju odredjenih ruta u controller fajlovima
 * 
 * za instalaciju CRUD-a:
 * cmd>npm i @nestjsx/crud @nestjsx/crud-typeorm @nestjsx/crud-request
 * -> da bismo mogli pokrenuti aplikaciju neophodan je class-transformer paket
 * cmd>npm i class-transformer 
 * 
 * Za podkategorije:
 * http://localhost:3000/api/category/?join=categories
 * 
 * 
 * @Predavanje 44
 * 
 * -> Proslijedjivanje vise inforamcija preko jedne rute, za vise entiteta u bazi
 * 
 * @Predavanje 45
 * 
 * -> Token i JSONWebToken 
 *
 * u auth.controller.ts fajlu radimo kodiranje same logike programa, gdje nam je neophodan i modul jsnowebtoken:
 * cmd> npm i jsonwebtoken
 * 
 * 
 * @Predavanje 46 
 * 
 * Kreiramo middleware : authorization.middlewares.ts fajl
 * 
 * @Predavanje 47 : Otpremanje datoteke, photo, rad u articleControler-u i pravljenje Post metode za ucitavanje fotografija...  
 * za diskStorage moramo da instaliramo multer
 * cmd>npm i @types/express -D
 * 
 * @Predavanje 48: 
 * 
 * U fileFilter metodi u aritcle.controller-u redefinisemo callback funkciju tako da ne stampa error poruku u 
 * sulucaju greske poslatog fajla, vec callback(null, false), i dodajemo @Req req u uploadPhoto() metodu, gdje provjeravamo
 * da li je req.ErrorHandler (ovaj objekat smo mi dodali i proizvoljno nazvali) postoji i vrati ApiResponse() 
 * 
 * @Predavanje 49: 
 * 
 * Provjeravamo mimetype poslatog fajla..
 * article.controller.ts je u pitanju 
 * 
 * radimo :
 * import * as fs from 'fs';
 * 
 * ii instalirali smo stariju verziju file-type : 
 * cmd> npm i file-type@16.5.3
 *  
 * nakon toga radimo resize sacuvanih fotografija, i pravimo dvije metode thumb i small
 * neophodan module za to je :
 * 
 * cmd>npm i sharp 
 * za promjenu velicine koristimo 
 * sharp.(filename).resize().toFile()
 * 
 * 
 * @Predavanje 52
 * 
 * pravimo feature.service.ts fajl
 * pravimo feature.controller.ts fajl
 * 
 * u Postman-u pravimo POST i GET metode.
 * 
 * @Predavanje 53
 * 
 * Brisanje podatak iz article.controller.ts 
 * Brisemo fotografiju
 * 
 * @Predavanje 54
 * 
 * editArticle objekat pravimo u dtos(data transfer object-u)
 * pravmio funkciju za isti objekat u article.service.ts
 * 
 * @Predavanje 55
 *
 * pravimo u auth.controller.ts novu rutu PUT user/register za registraciju korisnika
 * pravimo user.service.ts  za rutu
 * 
 * pravimo user registration dto za spomenutu rutu
 * 
 * 
 * @Predavanje 57
 * 
 * pravimo u auth.controller.ts fajlu jos jednu rutu "login/user"
 * namjenjenu za logovanje korisnika, i modifikovali smo loginAuthoInfo.dto.ts, zatim dodali smo userService.getByEmail() 
 * 
 * @Predavanje 58
 * 
 * kreiramo RolesGuard sloj koji posle http requesta i middleware-a  dolazi i provjera role, odnosno 
 * usmjeravamo sta user moze da posjeti sta ne, sta moze administrator sta ne itd...
 * 
 * pravimo role.chck.guards.ts fajl sa klasom  CanActivate i dodajemo request express paketu blok sa otpakovanim tokenom.
 * zatim ispod svake rute dodajemo po jednu anotaciju definisanu u allow.to.role.descriptor.ts fajlu @AllowToRoles
 * u fajlu role.check.guards.ts pravimo drugu anotaciju.
 * @UseGuards(RoleCheckedGuard)
 * @AllowToRoles('administrator')
 * 
 * */
