import { Component, OnInit } from "@angular/core";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";

@Component({
  selector: "app-score-card",
  templateUrl: "./score-card.component.html",
  styleUrls: ["./score-card.component.css"]
})
export class ScoreCardComponent implements OnInit {
  constructor(private taskMgtService: TaskmanagementService) {}
  ngOnInit() {
    window.scrollTo(0, 0);
  }
}
