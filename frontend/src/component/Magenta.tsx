// global を window にマッピング
(window as any).global = window;
import { useState } from 'react';
import { MusicRNN, Player, sequences, NoteSequence } from '@magenta/music';

type Props = {
  yData:number[]
}

export const Magenta: React.FC = (props:Props) => {
  const [status, setStatus] = useState<string>('');

  const handleCompose = async () => {
    setStatus('作曲中...');

    // 数値データとユーザーのフリーコメントを取得
    const timeSeriesData = getTimeSeriesData(); // 横軸時間、縦軸強度の数値データを取得する関数
    const userComment = getUserComment(); // ユーザーのフリーコメントを取得する関数

    // MagentaのRNNモデルを使用して曲を生成
    const rnn = new MusicRNN(
      'https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/basic_rnn'
    );
    await rnn.initialize();

    // 数値データをNoteSequenceに変換
    const noteSequence = timeSeriesToNoteSequence(timeSeriesData);

    // RNNモデルで曲を生成
    const rnnSteps = 128; // 生成するステップ数
    const temperature = 1.0; // 生成の多様性を制御するパラメータ
    const generatedSequence = await rnn.continueSequence(
      noteSequence,
      rnnSteps,
      temperature
    );

    // 生成された曲を再生
    const player = new Player();
    player.start(generatedSequence);

    setStatus('作曲完了');
  };

  const getTimeSeriesData = (): number[] => {
    // return wheelSpeedFL.map((elm) => elm * 0.0001);
    return props.yData.map((elm) => elm * 0.0001);
    //   return [0.1, 0.5, 0.3, 0.7, 0.2]; // 例としての数値データ
  };

  return (
    <div>
      <button onClick={handleCompose}>作曲</button>
      <p>{status}</p>
    </div>
  );
};

// 数値データをNoteSequenceに変換する関数
const timeSeriesToNoteSequence = (data: number[]): NoteSequence => {


  const notes: NoteSequence.INote[] = [];

  data.forEach((value, index) => {
    // 各タイムステップで複数のノートを生成
    for (let i = 0; i < 10; i++) {
      // 3和音を生成
      const basePitch = 60 + Math.floor(value * 12);
      const pitch = Math.max(
        0,
        Math.min(127, basePitch + Math.floor(Math.random() * 12 - 6) + i * 0.4)
      );
      notes.push({
        pitch,
        startTime: index * 0.5, // 時間を設定 (横軸)
        endTime: (index + 1) * 0.5, // 時間を設定 (横軸)
        velocity: Math.max(
          0,
          Math.min(
            127,
            Math.floor(value * 127) + Math.floor(Math.random() * 40 - 20)
          )
        ), // ベロシティを0から127の範囲に制限
      });
    }
  });

  const unquantizedSequence: NoteSequence = {
    ticksPerQuarter: 220,
    totalTime: data.length * 0.5,
    notes,
    timeSignatures: [{ time: 0, numerator: 4, denominator: 4 }],
    keySignatures: [{ time: 0, key: 0 }],
    tempos: [{ time: 0, qpm: 120 }],
  };

  unquantizedSequence.notes.forEach((note) => {
    note.pitch = Math.max(0, Math.min(127, note.pitch));
  });

  return sequences.quantizeNoteSequence(unquantizedSequence, 4);
};

// 数値データを取得するダミー関数


// ユーザーのフリーコメントを取得するダミー関数
const getUserComment = (): string => {
  return '楽しい気分'; // 例としてのフリーコメント
};
