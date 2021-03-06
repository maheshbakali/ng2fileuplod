import { Component, OnInit } from '@angular/core';
import {  FileUploader, FileSelectDirective, FileDropDirective } from 'ng2-file-upload/ng2-file-upload';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";


const URL = 'https://localhost:44345/api/FileUpload/UploadFiles'; //'http://localhost:4000/api/upload';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ng8fileupload';

  uploadForm: FormGroup;
  
  public uploader: FileUploader = new FileUploader({ url: URL, itemAlias: 'photo', isHTML5: true });

  public hasBaseDropZoneOver:boolean = false;
  public hasAnotherDropZoneOver:boolean = false;
  public isMultiple:boolean = true;

  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e:any):void {
    this.hasAnotherDropZoneOver = e;
  }

  constructor(private fb: FormBuilder, private http: HttpClient ) { }


  uploadSubmit(){
    for (let i = 0; i < this.uploader.queue.length; i++) {
      let fileItem = this.uploader.queue[i]._file;
      
      if(fileItem.size > 10000000){
        alert("Each File should be less than 10 MB of size.");
        return;
      }
    }
    for (let j = 0; j < this.uploader.queue.length; j++) {
      let data = new FormData();
      let fileItem = this.uploader.queue[j]._file;
      console.log(fileItem.name);
      data.append('file', fileItem);
      data.append('fileSeq', 'seq'+j);
      data.append( 'dataType', this.uploadForm.controls.type.value);
      this.uploadFile(data).subscribe(data => console.log(data.message));
    }
    this.uploader.clearQueue();
}

uploadFile(data: FormData): Observable<any> {
return this.http.post(URL, data);
}


  ngOnInit() {

    this.uploadForm = this.fb.group({
      document: [null, null],
      type:  [null, Validators.compose([Validators.required])]
    });

    /*this.uploader.onBuildItemForm = (item, form) => {
      form.append("file", item);
      };
    this.uploader.onAfterAddingFile = (file) => { 
      file.withCredentials = false;       
    };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
         console.log('ImageUpload:uploaded:', item, status, response);
         alert('File uploaded successfully');
    };

    function UploadMyFile(): void{

    };*/

 }
}