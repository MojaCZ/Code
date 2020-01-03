package main

import (
  "net/http"
  "html/template"
  "log"
)

var (
  tpl *template.Template
)

func init() {
  tpl = template.Must(template.ParseGlob("./templates/*gohtml"))
}

func main(){
  http.Handle("/Code/files/", http.StripPrefix("/Code/files", http.FileServer(http.Dir("./static"))))
  http.HandleFunc("/", index)

  err := http.ListenAndServe(":8085", nil)
  if err != nil {
    log.Fatalln(err)
  }
}

func index(w http.ResponseWriter, req *http.Request) {
  err := tpl.ExecuteTemplate(w, "index.gohtml", nil)
  if err != nil {
    log.Fatalln(err)
  }
}
