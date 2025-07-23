import { useEffect } from 'react';
import { useRaceStore } from '../store/race/raceStore';
import { useSearchParams } from 'react-router';

export const QueryParamHandler = () => {
  const [searchParams] = useSearchParams();
  const { setRunnerIds, setCategoryNo } = useRaceStore();

  useEffect(() => {
    // URLパラメータから値を取得
    const runnerIds = searchParams.getAll('runnerid');
    const categoryNo = searchParams.get('categoryNo') || '';

    // デバッグログ
    // console.log('URL Parameters:', {
    //   runnerIds,
    //   category,
    //   rawParams: Object.fromEntries(searchParams.entries()),
    // });

    if (runnerIds.length > 0) {
      setRunnerIds(runnerIds);
    }
    if (categoryNo) {
      setCategoryNo(Number(categoryNo));
    }
  }, [searchParams, setRunnerIds, setCategoryNo]);

  return null;
};
