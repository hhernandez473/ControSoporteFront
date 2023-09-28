import { Component, OnInit } from '@angular/core';
import { ApiService } from '../core/service/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Planned, RespPlanned } from '../core/models/RespPlanned';
import { HttpErrorResponse } from '@angular/common/http';
import { HomeVisit, RespHomeVisits } from '../core/models/RespHomeVisits';

@Component({
  selector: 'app-home-visits',
  templateUrl: './home-visits.component.html',
  styleUrls: ['./home-visits.component.css']
})
export class HomeVisitsComponent implements OnInit {
  plannedList: Planned[];
  homeVisitList: HomeVisit[];
  vistSituation: any[]= [
    {'situacion':'P', 'descripcion': 'PENDIENTE'},
    {'situacion':'E', 'descripcion': 'EN PROCESO'},
    {'situacion':'F', 'descripcion': 'FINALIZADA'},
    {'situacion':'C', 'descripcion': 'CANCELAR'},

  ];
  homeVisitForm: FormGroup;
  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.homeVisitForm = this.createHomeVisit();
    this.homeVisitForm.controls['idVisita'].disable();
   }

  ngOnInit(): void {
    this.getPlanneds();
    this.getHomeVisits();
  }

  createHomeVisit(data?: HomeVisit) {
    let homeVisit;
    if(data?.planned){
      homeVisit = this.plannedList.find(c => c.idPlanned == data.idPlanned);
    }
    return this.fb.group({
      uid: data?.uid || "",
      idVisita: data?.idVisita || "",
      idPlanned: data?.idPlanned || "",
      planned: [homeVisit || "", [Validators.required]],
      fecha_inicio: [data?.fecha_inicio || "", [Validators.required]],
      fecha_fin: [data?.fecha_fin || "", [Validators.required]],
      descripcion: [data?.descripcion || "", [Validators.required]],
      observacion1: [data?.observacion1 || "", [Validators.required]],
      observacion2: [data?.observacion2 || "", [Validators.required]],
      situacion: [data?.situacion || "", [Validators.required]],
    });
  }

  resetForm(){
    this.homeVisitForm = this.createHomeVisit();
    this.homeVisitForm.controls['idVisita'].disable();
  }


  formValidation(){
    if(this.homeVisitForm.invalid){
      this.homeVisitForm.markAllAsTouched();
      return;
    }
    this.homeVisitForm.controls['uid'].value ? this.updateHomeVisit(): this.saveHomeVisit();
  }

  editHomeVisitForm(data: HomeVisit){
    this.homeVisitForm = this.createHomeVisit(data);
    this.homeVisitForm.controls['idVisita'].disable();
  }

  private getPlanneds() {
    this.apiService.get("planneds").subscribe(
      (resp: RespPlanned) => {
        this.plannedList = resp.datos;
      },

      (error: HttpErrorResponse) => {
        // Si sucede un error
        console.error(error);
      }
    );
  }

  private getHomeVisits() {
    this.apiService.get("visitas").subscribe(
      (resp: RespHomeVisits) => {
        this.homeVisitList = resp.datos;
      },

      (error: HttpErrorResponse) => {
        // Si sucede un error
        console.error(error);
      }
    );
  }

  private saveHomeVisit(){
    const { uid, planned, idPlanned,  ...rest } = this.homeVisitForm.getRawValue();
    this.apiService
      .post("visitas", {
        ...rest,
        idPlanned: planned.idPlanned,
        planned: planned.uid
      })
      .subscribe(
        (resp: any) => {
          this.toastr.success("SATISFACTORIO", "REGISTRO GUARDADO EXISTOSAMENTE",  {
            timeOut: 8000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-success alert-with-icon",
            positionClass: "toast-top-right",
          });
          this.getPlanneds();
        },

        (error: HttpErrorResponse) => {
          // Si sucede un error
          console.error(error);
        }
      );
  }

  private updateHomeVisit(){
    const { uid, planned, idPlanned,  ...rest } = this.homeVisitForm.getRawValue();
    this.apiService
      .put(`visitas/${uid}`, {
        ...rest,
        idPlanned: planned.idPlanned,
        planned: planned.uid
      })
      .subscribe(
        (resp: any) => {
          this.toastr.success("SATISFACTORIO", "REGISTRO ACTUALIZADO EXISTOSAMENTE",  {
            timeOut: 8000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-success alert-with-icon",
            positionClass: "toast-top-right",
          });
          this.getPlanneds();
        },

        (error: HttpErrorResponse) => {
          // Si sucede un error
          console.error(error);
        }
      );
  }

}
