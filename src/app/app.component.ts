import { Component, Input } from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';

interface ProductHeirarchy {
  name: string;
  text ?: {en?: string, hu?: string}
  sub?: ProductHeirarchy[],
  link?: string
  expanded?: boolean
}

const TREE_DATA: ProductHeirarchy[] = [
  {
    name: 'Womens',
    expanded: true,
    text:{
      en: "Womens",
      hu: "Nok"
    },
    sub: [
      {name: 'All',   text:{en: "All", hu: "Mind"}, link:'category/Womens'},
      {name: 'Dresses',   text:{en: "Dresses", hu: "Ruhak"}, link:'category/Womens/Dresses'},
      {name: 'Blouses',   text:{en: "Blouses", hu: "Bluzok"}, link:'category/Womens/Blouses'},
      {name: 'Jumpsuits', text:{en: "Jumpsuits", hu: "Overalok"}, link:'category/Womens/Jumpsuits'},
      {name: 'Skirts',    text:{en: "Skirts", hu: "Szoknyak"}, link:'category/Womens/Skirts'},
      {name: 'Trousers',  text:{en: "Trousers", hu: "Nadragok"}, link:'category/Womens/Trousers'},
    ]
  },
   {
    name: 'Accessories',
    text:{
      en: "Accessories",
      hu: "Kiegyesegetik"
    },
    sub: [
      {name: 'Dresses',   text:{en: "Dresses", hu: "Ruhak"}, link:'category/Womens/Dresses'},
      {name: 'Blouses',   text:{en: "Blouses", hu: "Bluzok"}, link:'category/Womens/Blouses'},
      {name: 'Jumpsuits', text:{en: "Jumpsuits", hu: "Overalok"}, link:'category/Womens/Jumpsuits'},
      {name: 'Skirts',    text:{en: "Skirts", hu: "Szoknyak"}, link:'category/Womens/Skirts'},
      {name: 'Trousers',  text:{en: "Trousers", hu: "Nadragok"}, link:'category/Womens/Trousers'},
    ]
  },
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {

  treeControl = new NestedTreeControl<ProductHeirarchy>(node => node.sub);
  dataSource = new MatTreeNestedDataSource<ProductHeirarchy>();

  constructor() {
    this.dataSource.data = TREE_DATA;

    // check which nodes should be expanded by default
    TREE_DATA.forEach(item =>{
       if(item.expanded)
        this.treeControl.expand(item);
    });
    
  }

  hasChild = (_: number, node: ProductHeirarchy) => !!node.sub && node.sub.length > 0;

  title = 'yati-trend';
  sideNav = {
    opened: false
  };

  sideNavEvent(state : boolean){
     this.sideNav.opened = state;
  }

 
  
  
  


}
