export class Common{

    // filter hungrian accents for better comparison performance
    static filterAccents(input : string){
      if(input == null)
                  return input;
              else
                  return input
                  .replace(/á/g, 'a')            
                  .replace(/é/g, 'e')
                  .replace(/í/g, 'i')
                  .replace(/ó/g, 'o')
                  .replace(/ö/g, 'o')
                  .replace(/ő/g, 'o')
                  .replace(/ű/g, 'u')
                  .replace(/ú/g, 'u')
                  .replace(/ü/g, 'u')
                  .replace(/Á/g, 'A')            
                  .replace(/É/g, 'E')
                  .replace(/Í/g, 'I')
                  .replace(/Ó/g, 'O')
                  .replace(/Ö/g, 'O')
                  .replace(/Ő/g, 'O')
                  .replace(/Ű/g, 'U')
                  .replace(/Ú/g, 'U')
                  .replace(/Ü/g, 'U')
    }

}