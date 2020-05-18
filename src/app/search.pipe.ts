import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  pure: false
})
export class SearchPipe implements PipeTransform {

  transform(items: any[], filter: Object): any {
    if (!items || !filter) {
        return items;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return items.filter(filterFunction);

    // function for filtering items
    function filterFunction(item){
      let keys = Object.keys(filter);
      
      for(let i = 0; i < keys.length; i++){
        // if no search entered,show all items
        if(filter[keys[i]] == null)
          return true;
         if(filterAccents(item[keys[i]]).toLowerCase().indexOf(filterAccents(filter[keys[i]]).toLowerCase()) >= 0)
           return true;
      }
      return false;
   }

   // filter hungrian accents for better comparison performance
   function filterAccents(input : string){
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
 
  

}
