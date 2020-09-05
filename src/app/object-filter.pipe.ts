import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objectFilter'
})

// filters by object properties
export class ObjectFilterPipe implements PipeTransform {

  
  transform(items: any[], filter: Object): unknown {
    if (!items || !filter) {
      return items;
   }
    return items.filter(item =>{
        let props = Object.keys(filter);

        // check that each property matches condition
        for(let iProp = 0; iProp < props.length; iProp++){
          if(item[props[iProp]] != filter[props[iProp]])
            return false;
        }

        // if we are here, it means that all have been matched so we return true
        return true;
    });
  }

}
