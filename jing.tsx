/*
 * @file: description
 * @author: longjing03
 * @Date: 2021-12-10 15:10:21
 * @LastEditors: longjing03
 * @LastEditTime: 2021-12-18 23:49:28
 */
import React, { useEffect, useState, useRef } from "react";
import { Tabs, List, PullToRefresh, InfiniteScroll } from "antd-mobile";
import { getInterestHistory } from "@api/interestsHistory";
import { sleep } from "antd-mobile/es/utils/sleep";
import { getMonthAndYaerParam } from "@src/common/utils/date";
import { goto } from "@libs/goto";
import { parsePath } from "@libs/path";
import type {
  IHistoryRecord,
  INavHeader,
  IHeaderList,
} from "@src/types/interestsHistory.model";
import merchantKconf from "@src/api/kconf/index";
import "./index.less";
let count = 0;
async function mockRequest() {
  console.log(count, "99999");

  if (count >= 5) {
    return [];
  }
  await sleep(2000);
  count++;
  return [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
  ];
}
const InterestsHistory: React.FC = () => {
  const [historyRecord, setHistoryRecord] = useState([] as IHistoryRecord[]);

  const routeQuery: any = parsePath(location.href)?.query;
  const interestId = routeQuery.interestId;
  const [navKey, setNavKey] = useState(interestId);
  const [pageNum, setPageNum] = useState(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [data, setData] = useState<string[]>([]);
  // const [nowDate, setNowDate] = useState('');

  // 日期时间
  const nowDate =
    new Date().getMonth() + 1 === 12
      ? new Date().getFullYear() + 1 + "" + "01"
      : new Date().getFullYear() + "" + (new Date().getMonth() + 1);
  const [monthParam, setMonthParam] = useState(nowDate);

  const [tabInfo, setTabInfo] = useState([] as INavHeader[]);
  const [headerList, setHeaderList] = useState([] as IHeaderList[]);
  const wrapRef = useRef<any>(null);

  /**
   * @param month 接口参数 month
   * @description 请求数据方法
   */
  const getList = async (month: string) => {
    const res = await getInterestHistory(+navKey, month, 12);
    console.log("kkk");
    if (res.result === 1) {
      setPageNum((pageNum1) => pageNum1 + 1);
      setTabInfo(res.data?.tabInfo);
      const temp = res.data?.historyRecord;
      console.log(temp, "hjjhkhk");

      if (!temp.length) {
        // setHasMore(false);
      } else {
        const nowList = [...historyRecord, ...temp];
        // eslint-disable-next-line code-spec-unid/no-json-parse-or-json-stringify
        if (month === nowDate) {
          setHistoryRecord(temp);
        } else {
          setHistoryRecord(nowList);
        }
        if (pageNum > 1) {
          if (temp?.length === 12) {
            setMonthParam(temp[temp.length - 1]?.month);
          } else {
            // setHasMore(false);
          }
        }
      }
    }
  };

  /**
   * @param e 上拉的列表dom
   * @description 上拉逻辑
   */

  async function loadMore() {
    console.log("jing");
    const append = await mockRequest();
    setData((val) => [...val, ...append]);
    setHasMore(append.length > 0);
  }

  /**
   * @description 页面配置信息从kconf中获取
   */
  const getKconf = async () => {
    try {
      const kconfKey = "merchantEduFlowRight";
      const res = await merchantKconf.getKConfValue(kconfKey);
      if (!res?.[kconfKey]?.value) {
        // eslint-disable-next-line no-throw-literal
        throw { error_msg: "未获取到页面配置" };
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
    console.log("useEffect");
    getKconf();
    getList(nowDate);
    // const yodaDate = getMonthAndYaerParam();
    // setNowDate(yodaDate);
    // console.log(yodaDate, '000');
  }, []);

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
                        console.log("PullToRefresh");
                        setMonthParam(nowDate); //浏览器
                        setPageNum(1);
                        setHasMore(true);
                        getList(nowDate);
                      }}
                    >
                      {/* {historyRecord?.map((record, index1) => (
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
                      <InfiniteScroll loadMore={loadMore} hasMore={hasMore} threshold={10} /> */}
                      <List>
                        {data.map((i, index) => (
                          <List.Item key={index}>{i}</List.Item>
                        ))}
                      </List>
                      <InfiniteScroll
                        loadMore={loadMore}
                        hasMore={hasMore}
                        threshold={10}
                      />
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
