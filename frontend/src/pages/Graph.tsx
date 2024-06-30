import {Line} from 'react-chartjs-2';
import {ChartOptions} from 'chart.js';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
import styles from "./Graph.module.scss"

interface Props {
    xData: number[]
    yData: number[]
    title: string
    maxValue?: number
}


export const Graph: React.FC<Props> = ({ xData, yData, title,maxValue }) => {
    const data: {
        datasets: { backgroundColor: string; borderColor: string; data: number[]; label: string; fill: boolean }[];
        labels: string[]
    } = {
        labels: xData.map(x => x.toString()), // xDataを文字列に変換
        datasets: [
            {
                label: title,
                data: yData,
                fill: false,
                backgroundColor: 'rgb(75, 192, 192)',
                borderColor: 'rgba(75, 192, 192, 0.2)',
            },
        ],
    };

    const options: ChartOptions<"line"> = {
        scales: {
            y: {
                beginAtZero: true,
                max: maxValue
            }
        },
        plugins: {
            title: {
                display: true,
                text: title,
                font: {
                    size: 24 // ここでタイトルの文字の大きさを設定
                }
            }
        }
    };

    return <div className={styles.graphArea}>
        <Line data={data} options={options} />
    </div>
}

