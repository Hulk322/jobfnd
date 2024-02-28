import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TimesheetCodeService {

  constructor(private http: HttpClient) { }

  private SheetCodesUrl = environment.baseApiUrlClient+"/client/timesheetcode";

  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
   private httpOptions = {
    headers: this.headers_object
   };

  getSheetCodes(){
    return this.http.get(this.SheetCodesUrl, this.httpOptions);
  }

  add(sheet){
    return this.http.post(this.SheetCodesUrl, sheet, this.httpOptions);
  }

  update(sheet){
    return this.http.put(this.SheetCodesUrl+"/" + sheet.id, sheet, this.httpOptions);
  }

  delete(sheet){
    return this.http.delete(this.SheetCodesUrl+"/"+sheet.id, this.httpOptions);
  }
}
