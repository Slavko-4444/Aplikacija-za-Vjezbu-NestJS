import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
} 
bootstrap();
// kreiranje Nest aplikacije : cmd => nest new <ime aplikacije>
// pokretanje aplikacije, imamo sve u package.json  fajlu i to u odeljku script{}, sa tim samo pozovemo: npm run <naziv indexa iz skripte(start:dev npr.)>

// .gitignore -> ovo je dir koji sadrzi podatke koji su sve moduli i podaci koji se ne prate


// za rad sa git-om, inicijalizujemo ga 
// cmd> git init
// sa komandom git add . 
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
