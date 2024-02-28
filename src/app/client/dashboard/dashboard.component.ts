import { Component, OnInit,ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ErrorService } from 'src/Services/shared/error.service';
import { Router } from '@angular/router';
import timeGridPlugin from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import * as c3 from 'c3';



@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css']
})
export class ClientDashboardComponent implements OnInit {
	public chartData: Array<any>;
	  newChartData: any = {};
	 public c3Data = {};
	public barChartOptions = {
		scaleShowVerticalLines: false,
		responsive: true
	  };
	  public barChartLabels = [];
	  public barChartType = 'bar';
	  public barChartLegend = true;
	  public barChartData = [
		{data: [], label: 'Days'},
		{data: [], label: 'Applications'}
	  ];

	Url = environment.baseApiUrl + "/client/dashboard";

	message = '';
	activeJobs;
	todaysSubmissions;
	newSubmissions;
	todaysInterviews;
	pendingInterviews;
	readyForOffers;
	recentSubmissions;
	recentjobs;
	calendar : {
		interviews:[]
	};
	//dummy_data = [{'title': 'test', 'date': '2019-11-23'}];
	calendarPlugins = [dayGridPlugin,timeGridPlugin,listPlugin,interactionPlugin]; // important!
	isLoading = true;
	barChartsData:any=[]

	private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
	private httpOptions = {
		headers: this.headers_object
	}
	isNoData: any;

	constructor(
		private http: HttpClient,
		private router: Router,
		private _ErrorService: ErrorService
	) { }

	ngOnInit() {
        this.isNoData=true;
		return this.http.get(this.Url, this.httpOptions).subscribe(
			data => this.handleSuccess(data),
			error => this.handleError(error)
		);
		
	}

	chart_render(data:any) {
	  let chart = c3.generate({
	   bindto: '#chart',
		  data: data,
		  bar: {
			width: {
				ratio: 0.4 // this makes bar width 50% of length between ticks
			}
		},
		tooltip: {
			show: true
		},
		  grid: {
			x: {
				show: true
			},
			y: {
				show: true
			}
		},
		  axis: {
			x: {
			  type: 'timeseries',
			  tick: {
				format: "%b-%d"
			  }
			},
			y: {
			  show: true  // false to hide the y-axis line & ticks
			}
		  },
		  
	  })
	  
	}
	

	pie_chart(data) {
		let chart = c3.generate({
		 bindto: '#pie_chart',
			data: {
				// iris data from R
				columns: [
					['Open Jobs', data.data.totalClientJobs],
					['Applications',data.data.totalClientSubmissions],
				],
				type : 'pie',
				onclick: function (d, i) { console.log("onclick", d, i); },
				onmouseover: function (d, i) { console.log("onmouseover", d, i); },
				onmouseout: function (d, i) { console.log("onmouseout", d, i); }
			},
			color: {
				pattern: ['#55D8FE', '#A3A1FB']
			}
			
		})
		
	  }

	  donut_chart(data) {
		let chart = c3.generate({
		 bindto: '#dnut_chart',
			data: {
				columns: [
					['Jobs', data.data.totalClientJobs],
					['Applications', data.data.totalClientSubmissions ],
					['Offers', data.data.totalClientOffers ],
					['Hire', data.data.totalClientHires ]
				],
				type : 'donut',
				onclick: function (d, i) { console.log("onclick", d, i); },
				onmouseover: function (d, i) { console.log("onmouseover", d, i); },
				onmouseout: function (d, i) { console.log("onmouseout", d, i); }
			},
			legend: {
				position: 'bottom'
			},
			donut: {
				title: "Top Jobs Activities"
			},
			color: {
				pattern: ['#55D8FE', '#A3A1FB','#FFC162',"#FFA177","#FF7285"]
			}
			
		})
		
	  }

	handleSuccess(data) {
		console.log(data)
		if(data.data === ""){
			this.isNoData = false
		}
		this.message = data;
		this.activeJobs = data.data.activeJobs;
		this.todaysSubmissions = data.data.todaysSubmissions;
		this.newSubmissions = data.data.newSubmissions;
		this.pendingInterviews = data.data.pendingInterviews;
		this.readyForOffers = data.data.readyForOffers;
		this.todaysInterviews = data.data.todaysInterviews;
		this.calendar = data.data.calendar;
        this.recentjobs = data.data.recentJobs
		this.recentSubmissions = data.data.recentSubmissions;
		//this.calendar.interviews = this.dummy_data;
		this.isLoading = false;
		//this.barChartLabels = data.data.chart.days;
		// this.barChartData = [
		// 	{data: data.data.chart.jobSubmissionCount, label: 'Jobs'},
		// 	{data: data.data.chart.submissions, label: 'Submissions'}
		//   ];
		  this.barChartsData = data.data.chart.data;
		  this.barDatagenerate(this.barChartsData)
		  this.pie_chart(data)
		  this.donut_chart(data)
		  
	}
	barDatagenerate(data:any){

		//let submissionsCount:any;
		let barDatarray = [];
		let mx =[]
		let my=[]
		let temp_data=[]
		let ori_data=[]
		var C_charts = {x:'x',xFormat: "%Y-%m-%d",type:'bar',
		columns:[],colors: {
            Jobs: '#5FE2A0'
		},
	};
		mx.push('x')
		my.push('Jobs')
		
		for (let [key, value] of Object.entries(data)) {
			//value = Object.keys(value).find(key => value[key] === "submissionsCount");
			let date = key.split('-');
			let keys = date[1]+'-'+date[2];
			barDatarray.push([keys,parseInt(value["submissionsCount"])]);
			temp_data.push([key,parseInt(value["submissionsCount"])])
		    //my.push(value["submissionsCount"])
	 }
	 this.chartData = barDatarray;
	  temp_data.map(function(v){
		var b = v[1] !== 0 ? ori_data.push(v) : 0;
		return b
		})
	ori_data.map(v => mx.push(v[0]))
    ori_data.map(v => my.push(v[1]))
	 C_charts['columns'].push(mx);
	 C_charts['columns'].push(my);
	 //this.c3Data=C_charts
	 this.chart_render(C_charts)
	}

	handleError(error) {
		console.log(error);
		this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
	}

	goToJobs() {
		this.router.navigateByUrl('/client/jobs');
	}

	goToSubmissions() {
		this.router.navigateByUrl('/client/submissions');
	}

	goToInterviews() {
		this.router.navigateByUrl('/client/interviews');
	}

	goToOffers() {
		this.router.navigateByUrl('/client/offers');
	}

}
