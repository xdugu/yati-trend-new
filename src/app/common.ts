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

    //given the country code and knowing the language from preferences, this function returns the 
   //country string
   static getCountry(countryCode : string, lang : string){
        let countries = {
            HU:{
                en:"Hungary",
                hu:"Magyarország",
            },
            DE:{
                en:"Germany",
                hu:"Németország"
            },
            AT:{
                en:"Austria",
                hu:"Ausztria"
            },
            GB:{
                en:"United Kingdom",
                hu:"Egyesült Királyság"
            }
        }

        return(countries[countryCode][lang.toLowerCase()]);

    }

    // given a full filename, this function returns the full filename without the extension
    static removeExtension(name){
    
        // search for beginning of extension index
        let extInd = name.search(/\.[a-z]{2,}$/i);
        
        if(extInd >= 0){
            return name.substring(0, extInd);
        }
        else
            return name;
    }    

}