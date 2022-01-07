/*
 * @file: description
 * @author: longjing03
 * @Date: 2021-12-18 11:04:33
 * @LastEditors: longjing03
 * @LastEditTime: 2021-12-18 11:04:34
 */
/*
 * @file: description
 * @author: longjing03
 * @Date: 2021-12-10 15:10:21
 * @LastEditors: longjing03
 * @LastEditTime: 2021-12-18 10:59:52
 */
import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { Tabs, List, Loading, PullToRefresh } from 'antd-mobile';
import { getInterestHistory } from '@api/interestsHistory';
import { sleep } from 'antd-mobile/es/utils/sleep';
import { getMonthAndYaerParam } from '@src/common/utils/date';
import { goto } from '@libs/goto';
import { $bridge } from '@es/es-bridge';
import { parsePath } from '@libs/path';
import type { IHistoryRecord, INavHeader, IHeaderList } from '@src/types/interestsHistory.model';
import merchantKconf from '@src/api/kconf/index';
import './index.less';

const InterestsHistory: React.FC = () => {
  const [historyRecord, setHistoryRecord] = useState([] as IHistoryRecord[]);

  const routeQuery: any = parsePath(location.href)?.query;
  const interestId = routeQuery.interestId;
  const [navKey, setNavKey] = useState(interestId);
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // 日期时间
  const nowDate =
    new Date().getMonth() + 1 === 12
      ? new Date().getFullYear() + 1 + '' + '01'
      : new Date().getFullYear() + '' + (new Date().getMonth() + 1);
  const [monthParam, setMonthParam] = useState(nowDate);
  // 浏览器;
  // const [monthParam, setMonthParam] = useState(getMonthAndYaerParam()); // 手机

  const [tabInfo, setTabInfo] = useState([] as INavHeader[]);
  const [headerList, setHeaderList] = useState([] as IHeaderList[]);
  const wrapRef = useRef<any>(null);

  const data = {
    tabInfo: [
      //顶部tab列表
      {
        title: '流量助推',
        interestId: 13,
      },
    ],
  };

  /**
   * @param month 接口参数 month
   * @description 请求数据方法
   */
  const getList = async (month: string) => {
    console.log('enter');

    setLoading(true); // 设为请求状态
    // eslint-disable-next-line code-spec-unid/catch-promise-rejection
    // await getInterestHistory(+navKey, month, 12)
    //   .then((res: any) => {
    //     if (!tabInfo?.length) {
    //       setTabInfo(res.data?.tabInfo);
    //     }
    //     console.log('then');

    //     const temp = res.data?.historyRecord;
    //     if (!temp.length) {
    //       setHasMore(false);
    //     } else {
    //       const nowList = pageNum === 1 ? temp : [...historyRecord, ...temp];
    //       setHistoryRecord(nowList);
    //       if (pageNum >= 1) {
    //         if (temp?.length === 12) {
    //           setMonthParam(temp[temp.length - 1]?.month);
    //         } else {
    //           setHasMore(false);
    //         }
    //       }
    //     }
    //   })
    //   .finally(() => {
    //     setLoading(false); // 请求完毕置为false
    //   });
    // eslint-disable-next-line code-spec-unid/catch-promise-rejection
    const res = await getInterestHistory(+navKey, month, 12);
    if (res.result === 1) {
      if (!tabInfo?.length) {
        setTabInfo(res.data?.tabInfo);
      }
      setTimeout(() => {
        console.log(tabInfo, 'tabInfo');
      }, 5000);
      const temp = res.data?.historyRecord;
      if (!temp.length) {
        setHasMore(false);
      } else {
        const nowList = pageNum === 1 ? temp : [...historyRecord, ...temp];
        setHistoryRecord(nowList);
        if (pageNum >= 1) {
          if (temp?.length === 12) {
            setMonthParam(temp[temp.length - 1]?.month);
          } else {
            setHasMore(false);
          }
        }
      }
      setLoading(false); // 请求完毕置为false
    }
    console.log('jing');
  };

  /**
   * @param e 上拉的列表dom
   * @description 上拉逻辑
   */
  const loadMore = (e: any) => {
    const { offsetHeight, scrollTop, scrollHeight } = e.target;
    const height = scrollHeight - (offsetHeight + scrollTop);
    if (height === 0 || height === 1) {
      if (loading) return;
      setPageNum((pageNum1) => pageNum1 + 1);
    }
  };

  /**
   * @description 页面配置信息从kconf中获取
   */
  const getKconf = async () => {
    try {
      const kconfKey = 'merchantEduFlowRight';
      const res = await merchantKconf.getKConfValue(kconfKey);
      if (!res?.[kconfKey]?.value) {
        // eslint-disable-next-line no-throw-literal
        throw { error_msg: '未获取到页面配置' };
      }
      setHeaderList(res?.[kconfKey]?.value?.tableList);
    } catch (e) {
      console.log(e);
    }
  };

  /**
   * @description 列表里面的跳转逻辑
   */
  const handleDescClick = (value: IHistoryRecord) => {
    const { statusType, statusLink } = value.statusDetail;
    if (statusType === 1) {
      statusLink && goto(statusLink);
    }
  };

  useEffect(() => {
    getKconf();
    // let Dom: any;
    // const timeout = setTimeout(() => {
    //   console.log(tabInfo, 'jing');
    //   Dom = wrapRef.current;
    //   console.log(wrapRef.current, 'wrapRef.current');

    //   Dom.addEventListener('scroll', loadMore);
    //   console.log(tabInfo, 'kugjyfhgf');
    // }, 0);
    // return () => {
    //   Dom.removeEventListener('scroll', loadMore);
    //   timeout && clearTimeout(timeout);
    // };
    // debugger;
    // (async () => {
    //   await getList(nowDate);
    // })();
    // console.log(tabInfo, 'kugjyfhgf');

    // const Dom = wrapRef.current;
    // console.log(Dom, 'hkhhk');

    // Dom.addEventListener('scroll', loadMore);
    // return () => {
    //   Dom.removeEventListener('scroll', loadMore);
    // };
  }, []);

  // 之后多个tab要依赖 navKey
  // useEffect(() => {
  //   (async () => {
  //     setHasMore(true);
  //     setPageNum(1);
  //     setMonthParam(nowDate); //浏览器
  //     // setMonthParam(getMonthAndYaerParam()); // 手机
  //     const date = new Date();

  //     getList(nowDate);
  //   })();

  //   getKconf();

  //   const Dom = wrapRef.current;
  //   Dom.addEventListener('scroll', loadMore);
  //   return () => {
  //     Dom.removeEventListener('scroll', loadMore);
  //   };
  // }, [navKey]);

  useEffect(() => {
    hasMore && getList(monthParam);
    const Dom = wrapRef.current;
    console.log(Dom, 'hkhhk');

    Dom.addEventListener('scroll', loadMore);
    return () => {
      Dom.removeEventListener('scroll', loadMore);
    };
  }, [pageNum]);

  return (
    <div className="history">
      <div className="history-navbar">
        <Tabs
          activeKey={navKey}
          className="history-navbar-tab"
          onChange={(key) => {
            setNavKey(key);
          }}
        >
          {tabInfo?.map((item: any) => {
            return (
              <Tabs.TabPane
                title={item.title}
                key={item.interestId}
                className="history-navbar-tab__item"
              >
                <div className="history-navbar-tab__item-table">
                  <div className="list-header">
                    {headerList?.map((tabitem: IHeaderList) => {
                      return <div key={tabitem.key}>{tabitem.value}</div>;
                    })}
                  </div>

                  <div className="list-item" ref={wrapRef}>
                    <PullToRefresh
                      onRefresh={async () => {
                        await sleep(500);
                        // setMonthParam(getMonthAndYaerParam()); // 手机
                        setMonthParam(nowDate); //浏览器
                        setPageNum(1);
                        setHasMore(true);
                        getList(nowDate);
                      }}
                    >
                      {historyRecord?.map((record, index1) => (
                        <List.Item key={record?.levelPeriod}>
                          <div className="list-item-detail period">{record.levelPeriod}</div>
                          <div className="list-item-detail interest">{record.interestDesc}</div>
                          <div
                            className="list-item-detail statusDesc"
                            onClick={() => {
                              handleDescClick(record);
                            }}
                          >
                            {`${record.statusDetail?.statusDesc} >`}{' '}
                          </div>
                        </List.Item>
                      ))}

                      <div className="list-loading">
                        {hasMore ? (
                          <div>
                            <span>Loading</span>
                            <Loading />
                          </div>
                        ) : (
                          <span>..没有更多历史记录..</span>
                        )}
                      </div>
                    </PullToRefresh>
                  </div>
                </div>
              </Tabs.TabPane>
            );
          })}
        </Tabs>
        <button></button>
      </div>
    </div>
  );
};

export default InterestsHistory;
