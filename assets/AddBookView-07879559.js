import{d,D as n,b as u,h as e,q as m,e as c,a as i,u as p,n as l,k as _}from"./index-e670b3a1.js";import{A as f}from"./add-cbad5679.js";import{B as k}from"./BookForm-f0d8f412.js";import{u as B}from"./book-store-7d08f441.js";import{F as h}from"./flash-types-c1cf48c2.js";import"./lodash-bf2fda92.js";const S=c("h1",null,"New Book",-1),g=d({__name:"AddBookView",setup(w){const a=_(),{addBook:t}=B(),{addFlash:s}=n(),r=async o=>{await t(o),s({status:h.SUCCESS,message:"Book added"}),await a.push({name:"books",query:{page:-1}})};return(o,F)=>(i(),u("div",null,[S,e(k,{"onUpdate:modelValue":r},{default:m(()=>[e(p(f)),l(" Add ")]),_:1})]))}});export{g as default};
