import { Component, OnInit } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';

import { ChartConfiguration, ChartOptions, Plugin } from 'chart.js';
import { ImageResponse } from '../../models/image-res';
import { ImageStatResponse } from '../../models/image-stat-res';
import { AllStarService } from '../../services/api/allstar.service';
import { StorageService } from '../../services/storage.service';
import { UserRes } from '../../models/user-res';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [NgChartsModule, CommonModule, FontAwesomeModule],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {
  dates: string[] = [];
  Images: ImageStatResponse[] = [];

  faSpinner = faSpinner;

  constructor(
    private allStarService: AllStarService,
    private activateRoute: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
    // get the last 7 days
    for (let i = 8; i >= 1; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      this.dates.push(date.toDateString());
    }
    this.dates.push(new Date().toDateString());

    // get userId from url
    const userId = this.activateRoute.snapshot.params['id'] || null;

    if (!userId) {
      window.location.href = '/';
    }

    // get the images
    this.Images = await this.allStarService.getImagesStat(userId);

    //  y min start rouned 1490 -> 1400 mininum in list
    let min = Math.min(
      ...this.Images.map((image: ImageStatResponse) =>
        Math.min(...image.scores)
      )
    );
    let max = Math.max(
      ...this.Images.map((image: ImageStatResponse) =>
        Math.max(...image.scores)
      )
    );

    this.scatterChartOptions = {
      responsive: true,
      layout: {
        padding: {
          top: 10,
          left: 10,
          right: 10,
          bottom: 10,
        },
      },
      scales: {
        x: {
          border: {
            color: 'pink',
          },
          title: {
            display: true,
            text: 'Date',
            color: '#fff',
            font: {
              size: 20,
              weight: 700,
            },
          },
          beginAtZero: true,
          min: 0.6,
          max: 8.6,
          ticks: {
            color: '#f0f',
            font: {
              size: 10,
              weight: 700,
            },
            callback: (value: any, index: any, values: any) => {
              if (index == 0 || index > 8) return '';
              return this.dates[index] + '';
            },
          },
        },
        y: {
          border: {
            color: 'pink',
          },
          title: {
            display: true,
            text: 'Score',
            color: '#fff',
            font: {
              size: 20,
              weight: 700,
            },
          },
          min: Number(min) - 5,
          max: Number(max) + 5,
          ticks: {
            color: '#f00',
            font: {
              size: 10,
              weight: 700,
            },
          },
        },
      },
      plugins: {
        title: {
          display: true,
          text: 'Score vs Date',
          color: '#fff',
          font: {
            size: 20,
            weight: 700,
          },
        },
        legend: {
          display: false,
          labels: {
            color: '#fff',
            font: {
              size: 20,
              weight: 700,
            },
          },
        },
        tooltip: {
          enabled: false,
          position: 'nearest',
          external: this.externalTooltipHandler,
        },
      },
    };
    this.scatterChartData = {
      datasets: this.Images.map((image: ImageStatResponse) => {
        return {
          data: image.scores.map((score, index) => {
            return { x: index + 1, y: score };
          }),
          label: `${image.name} (${image.series_name})`,
          fill: false,
          tension: 0.5,
          borderColor: this.getRandomColor(),
          backgroundColor: 'rgba(255,0,0,0.3)',
          pointStyle: this.createCanvas(image.imageURL),
          pointRadius: 10,
          pointHoverRadius: 30,
          showLine: true,
        };
      }),
    };
  }

  getOrCreateTooltip = (chart: {
    canvas: {
      parentNode: {
        querySelector: (arg0: string) => any;
        appendChild: (arg0: any) => void;
      };
    };
  }) => {
    let tooltipEl = chart.canvas.parentNode.querySelector('div');

    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.style.background = 'rgba(0, 0, 0, 0.7)';
      tooltipEl.style.borderRadius = '3px';
      tooltipEl.style.color = 'white';
      tooltipEl.style.opacity = 1;
      tooltipEl.style.pointerEvents = 'none';
      tooltipEl.style.position = 'absolute';
      tooltipEl.style.transform = 'translate(-50%, 0)';
      tooltipEl.style.transition = 'all .1s ease';

      const table = document.createElement('table');
      table.style.margin = '0px';

      tooltipEl.appendChild(table);
      chart.canvas.parentNode.appendChild(tooltipEl);
    }

    return tooltipEl;
  };

  externalTooltipHandler = (context: { chart: any; tooltip: any }) => {
    // Tooltip Element
    const { chart, tooltip } = context;
    const tooltipEl = this.getOrCreateTooltip(chart);

    // Hide if no tooltip
    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = 0;
      return;
    }

    // Set Text
    if (tooltip.body) {
      const titleLines = tooltip.title || [];
      const bodyLines = tooltip.body.map((b: { lines: any }) => b.lines);

      const tableHead = document.createElement('thead');

      titleLines.forEach((title: string) => {
        const tr = document.createElement('tr');
        tr.style.borderWidth = '0';

        const th = document.createElement('th');
        th.style.borderWidth = '0';
        const text = document.createTextNode(title);

        th.appendChild(text);
        tr.appendChild(th);
        tableHead.appendChild(tr);
      });

      const tableBody = document.createElement('tbody');
      bodyLines.forEach((body: string, i: string | number) => {
        const images = tooltip.labelPointStyles[i];

        // const image = document.createElement('img');
        let image: HTMLCanvasElement = images.pointStyle;

        // const colors = tooltip.labelColors[i];
        // const span = document.createElement('span');
        // span.style.background = colors.backgroundColor;
        // span.style.borderColor = colors.borderColor;
        // span.style.borderWidth = '2px';
        // span.style.marginRight = '10px';
        // span.style.height = '10px';
        // span.style.width = '10px';
        // span.style.display = 'inline-block';

        const tr = document.createElement('tr');
        tr.style.backgroundColor = 'inherit';
        tr.style.borderWidth = '0';

        const td = document.createElement('td');
        td.style.borderWidth = '0';

        // create custom text 1
        const text1 = document.createTextNode(`${body[0].split(':')[0]}`);

        td.appendChild(image);
        td.appendChild(text1);
        tr.appendChild(td);
        tableBody.appendChild(tr);

        // create custom text 2
        let value = body[0].split(', ')[1].slice(0, -1);
        const currentIndex = tooltip.dataPoints[i].raw.x;
        const currentDatasetIndex = tooltip.dataPoints[i].datasetIndex;
        const currentScore = parseInt(value.replace(',', ''));
        const previousScore =
          currentIndex > 0
            ? +this.Images[currentDatasetIndex].scores[currentIndex - 2]
            : currentScore;
        const isIncrease = currentScore > previousScore;
        const text3 = document.createElement('span');
        text3.style.position = 'relative';
        text3.style.textAlign = 'right';
        const text2 = document.createElement('div');
        text2.textContent = `Score: ${value}`;
        text2.style.position = 'relative';
        text2.style.padding = '5px';

        let span2 = document.createElement('span');
        // new span value text position follow span2
        let spanValue = document.createElement('span');
        if (currentIndex > 1 && currentScore !== previousScore) {
          span2.textContent =
            (isIncrease ? '↑' : '↓') +
            ' ' +
            Math.abs(currentScore - previousScore);
          span2.style.color = isIncrease ? '#4caf50' : '#f44336';
          span2.style.fontSize = '12px';
          span2.style.textAlign = 'right';
          // spanValue.textContent = '' + Math.abs(currentScore - previousScore);
        } else {
          // remove
          span2.textContent = '';
          // spanValue.textContent = '';
        }

        // spanValue.style.textAlign = 'right';
        // spanValue.style.fontSize = '10px';
        // spanValue.style.position = 'absolute';
        // spanValue.style.top = `0px`;
        // // Create a temporary span element to measure the width of the content
        // const tempSpan = document.createElement('span');
        // tempSpan.textContent = spanValue.textContent;
        // tempSpan.style.visibility = 'hidden'; // Ensure it's not visible

        // // Append the temporary span to the body to calculate its width
        // document.body.appendChild(tempSpan);
        // const width = tempSpan.offsetWidth ; // Get the calculated width

        // // Remove the temporary span from the DOM
        // document.body.removeChild(tempSpan);

        // // Set the right property based on the calculated width
        // spanValue.style.right = `-${width / 2 }px`;
        // spanValue.style.color = isIncrease ? '#4caf50' : '#f44336';

        // absolute increase value ^ , or decrease
        const tr2 = document.createElement('tr');
        tr2.style.backgroundColor = 'inherit';
        tr2.style.borderWidth = '0';

        const td2 = document.createElement('td');
        td2.style.borderWidth = '0';
        text3.appendChild(text2);
        if (span2) {
          text3.appendChild(span2);
        }
        text3.style.display = 'flex'; // Set display to flex
        td2.appendChild(text3);
        tr2.appendChild(td2);
        tableBody.appendChild(tr2);
      });

      const tableRoot = tooltipEl.querySelector('table');

      // Remove old children
      while (tableRoot.firstChild) {
        tableRoot.firstChild.remove();
      }

      // Add new children
      tableRoot.appendChild(tableHead);
      tableRoot.appendChild(tableBody);
    }

    const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1;
    tooltipEl.style.left = positionX + tooltip.caretX + 'px';
    tooltipEl.style.top = positionY + tooltip.caretY + 'px';
    tooltipEl.style.font = tooltip.options.bodyFont.string;
    tooltipEl.style.padding =
      tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
  };

  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  createCanvas(src: string) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.width = 30;
    img.height = 30;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.beginPath();
        ctx.arc(img.width / 2, img.height / 2, img.width / 2, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(img, 0, 0, img.width, img.height);
      }
    };
    img.src = src;
    return canvas;
  }

  public scatterChartData!: ChartConfiguration<'scatter'>['data'];

  public scatterChartOptions!: ChartOptions<'scatter'>;

  public customCanvasBackgroundColor: Plugin = {
    id: 'customCanvasBackgroundColor',
    beforeDraw: (chart, args, options) => {
      const { ctx } = chart;
      ctx.save();
      ctx.globalCompositeOperation = 'destination-over';
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, 0, chart.width, chart.height);
      ctx.restore();
    },
  };

  public scatterChartLegend = false;
  public scatterChartPlugins: ChartConfiguration<'scatter'>['plugins'] = [
    this.customCanvasBackgroundColor,
  ];
}
