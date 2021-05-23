import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  isFieldsEmpty: boolean = false;

  constructor(private http: HttpClient,
    private router: Router) { }

  ngOnInit(): void {
  }

  validation(name, pass) {
     if (name === "" || pass === "") {
      console.log("sfghdehj");
      return alert("please fill al fields")
    }else{
      this.signUp(name, pass)
    }
  }

  signUp(name, pass) {
   
    this.http.post<any>("http://localhost:1000/signUp", { name, pass }).subscribe(res => {
      //wirte if user created or already exist 
      console.log(res)
      if (res.statusCode === 200) {
        alert("user added");
        this.router.navigate(['/menu'])
      }
    }, er => {
      console.log(er);
      alert(er.error.error);
    });
  }
}
