const { default: chalk } = require("chalk");

function boot() {
  console.log(
    chalk.cyan(`   _  __ _       __    _                       
  / |/ /(_)___  / /   (_)__ _  __ __ ____ ___ _
 /    // /(_-< / _ \\ / //  ' \\/ // // __// _ \`/
/_/|_//_//___//_//_//_//_/_/_/\\_,_//_/   \\_,_/ 
                                                `)
  );

  console.log(chalk.red(`[ SC BY A. RENDI PRAYOGA ]`));
  console.log(
    chalk.green(`
Info Script :
➸ Baileys \t: Multi Device
➸ Nama Script \t: AvriStant
➸ Creator \t: Avrizal Rendi Prayoga

Follow My Social Media Account :
➸ My Instagram : @avrzll_

Donate Me For Support :
➸ DONASI : https://h.top4top.io/p_27809m1wg1.jpg

Thanks\n\n`)
  );

  console.log(chalk.yellow`Connecting . . .`);
}

module.exports = { boot };
