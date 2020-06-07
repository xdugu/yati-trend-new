import { Component, Input } from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {ShopSpineService} from './shop-spine.service'

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
      hu: "Ruházat"
    },
    sub: [
      {name: 'All',   text:{en: "All", hu: "Mind"}, link:'category/Womens'},
      {name: 'Dresses',   text:{en: "Dresses", hu: "Ruhák"}, link:'category/Womens/Dresses'},
      {name: 'Blouses',   text:{en: "Blouses", hu: "Blúzok"}, link:'category/Womens/Blouses'},
      {name: 'Jumpsuits', text:{en: "Jumpsuits", hu: "Overálok"}, link:'category/Womens/Jumpsuits'},
      {name: 'Skirts',    text:{en: "Skirts", hu: "Szoknyák"}, link:'category/Womens/Skirts'},
      {name: 'Trousers',  text:{en: "Trousers", hu: "Nadrágok"}, link:'category/Womens/Trousers'},
    ]
  },
   {
    name: 'Accessories',
    text:{
      en: "Accessories",
      hu: "Kiegészítők"
    },
    sub: [
      {name: 'All',   text:{en: "All", hu: "Mind"}, link:'category/Accessories'},
      {name: 'Earrings',   text:{en: "Earrings", hu: "Fülbevalók"}, link:'category/Accessories/Earrings'},
      {name: 'Bracelets',   text:{en: "Bracelets", hu: "Karkötők"}, link:'category/Accessories/Bracelets'},
      {name: 'Necklaces', text:{en: "Necklaces", hu: "Nyakláncok"}, link:'category/Accessories/Necklaces'},
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
  config = null;

  constructor(private shopService : ShopSpineService) {
    this.dataSource.data = TREE_DATA;

    // check which nodes should be expanded by default
    TREE_DATA.forEach(item =>{
       if(item.expanded)
        this.treeControl.expand(item);
    });

    // get config
    shopService.getConfig().subscribe(config =>{
       this.config = config;
    })
    
  }

  hasChild = (_: number, node: ProductHeirarchy) => !!node.sub && node.sub.length > 0;

  title = 'yati-trend';
  sideNav = {
    opened: false
  };

  sideNavEvent(){
     this.sideNav.opened = !this.sideNav.opened;
  }

 
  
  
  


}
