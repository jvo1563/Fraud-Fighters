import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Report } from '../models/report';
import { Router } from '@angular/router';
import { BuisnessEntity } from '../models/buisness-entity';
import { HttpService } from '../services/http.service';
import { CategoryEntity } from '../models/category-entity';
import { StatusEntity } from '../models/status-entity';
import { BuisnessCardComponent } from '../buisness-card/buisness-card.component';
import { initFlowbite } from 'flowbite';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-anonymous-report',
  standalone: true,
  imports: [FormsModule, BuisnessCardComponent, CommonModule],
  templateUrl: './anonymous-report.component.html',
  styleUrl: './anonymous-report.component.css',
})
export class AnonymousReportComponent {
  //store local data for creating report
  report: Report = new Report();
  buis_entities: BuisnessEntity[] = [];
  buis_entity: BuisnessEntity = new BuisnessEntity();
  categories: CategoryEntity[] = [];
  statuses: StatusEntity[] = [];

  //need to anonymously get categories to choose from and statuses so we know what status id is associated with "Pending"
  constructor(private router: Router, private httpService: HttpService) {
    // this.httpService.anonymousGetCategories().subscribe((data) => {
    //   this.categories = data.body ? data.body : [];
    // });

    // this.httpService.anonymousGetStatus().subscribe((data) => {
    //   this.statuses = data.body ? data.body : [];
    // });
    this.httpService.getAllCategories().subscribe((data) => {
      //need categories to choose from
      if (data.body) {
        this.categories = data.body;
      }
    });

    this.httpService.getAllStatus().subscribe((data) => {
      //need to know what status is associated with what id
      if (data.body) {
        this.statuses = data.body;
      }
    });
    this.refreshFlowbite();
  }

  //When contact BE this should be order of operations:
  //  -save report, then we need the reports id after this, can be a seperate get, or we can design custom post w/ return new id... idk
  //  -then need to loop through buisness entities and add them one at a time, BUT first set the report id using the return from the first step
  submitReport() {
    for (let status of this.statuses) {
      //find id for pending
      if (status.status_name === 'Pending') {
        this.report.status_id = status.id;
      }
    }
    // this.httpService
    //   .createAnonymousReport(this.report, this.buis_entities)
    //   .subscribe((data) => {
    //     if (data.body) {
    //       console.log('Anonymous Business Create Success!');
    //     }
    //   });
    // this.router.navigate(['']);
    let newReportId: number = 0;
    console.log(this.report);
    this.httpService.createReport(this.report).subscribe((data) => {
      if (data.body) {
        newReportId = data.body.id;
        if (newReportId === 0) {
          this.router.navigate(['']);
        } else {
          for (let buis of this.buis_entities) {
            //post buisness entities
            buis.report_id = newReportId;
            this.httpService.createBuisness(buis).subscribe((data) => {
              console.log('Create Bussiness Success!');
            });
          }
        }
      }
      this.router.navigate(['']);
    });
  }

  updateBuisnessEntity(index: number, diffEntity: BuisnessEntity) {
    // Find entity at index and update it
    this.buis_entities[index] = diffEntity;
  }

  // they need their own id for the modal to work
  counter: number = 1;
  addBuisnessEntity() {
    this.buis_entity.id = this.counter;
    this.counter++;
    this.buis_entities.push(this.buis_entity);
    this.buis_entity = new BuisnessEntity();
    this.refreshFlowbite();
  }

  //remove business entity from local list, hasn't been posted yet, so no need to reach out to BE
  removeBuisnessEntity(index: number) {
    let temp_entities: BuisnessEntity[] = [];
    for (let i = 0; i < this.buis_entities.length; i++) {
      if (i !== index) {
        temp_entities.push(this.buis_entities[i]);
      }
    }
    this.buis_entities = temp_entities;
  }

  //return back to home page
  returnToHome() {
    this.router.navigate(['']);
  }

  //refresh page when data is populated
  refreshFlowbite() {
    setTimeout(() => {
      initFlowbite();
    }, 100);
  }
}
