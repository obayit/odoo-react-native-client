import React, { useEffect, useState } from 'react';
import { Text, FlatList, View, StyleSheet, ScrollView, Dimensions } from 'react-native';

import { FeatureContainer, ReusableStyles } from '../components';
import { emptyList, emptyObject, injectQuery, odooApi } from '../common/store/reduxApi';
import MenuView from '../components/MenuView';
import DebugView from '../components/DebugView';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";
import { CustomButton } from '../components/CustomButtons';


export default ({ navigation, route }) => {
  const rs = ReusableStyles
  const recordId = 1
  const { useQuery } = injectQuery('obi.dashboard.screen');
  const query = useQuery({
    kwargs: {
      fields: [
        'id',
        'name',
        'view_ids',
      ],
      domain: [
        ['id', '=', recordId],
      ]
    },
  },
  );
  const { data, isLoading } = query
  const records = data?.records ?? emptyList
  const screenRecord = records?.length ? records[0] : emptyObject

  return (
    query.error ? <Text style={rs.textDanger}>{JSON.stringify(query.error, null, 2)}</Text>
      :
      <ScrollView>
        {/* <CustomButton onPress={() => query.refetch() && st.refetch()}>refresh</CustomButton> */}
        <Text style={styles.titleText}>{screenRecord.name}</Text>
        <ViewStrategy view_ids={screenRecord?.view_ids} />
      </ScrollView>
  );
};

function isDeviceTablet() {
  return Dimensions.get("window").width > 400
}

function ViewStrategy(props) {
  console.log('#Dimensions.get("window").width');
  console.log(Dimensions.get("window").width);
  if (isDeviceTablet()) {
    return <StrategyForTablet {...props} />
  } else {
    return <StrategyForPhone {...props} />
  }
}

const toCouples = arr =>
  arr.reduce((acc, val, i) => {
    if (i % 2 === 0) {
      acc.push(i + 1 < arr.length ? [val, arr[i + 1]] : [val]);
    }
    return acc;
  }, []);


function StrategyForTablet({ view_ids }) {
  const couples = view_ids?.length ? toCouples(view_ids) : []
  const chartWidth = Dimensions.get("window").width * .45
  console.log('#couples ___________________________________');
  console.log(couples);
  return (
    <ScrollView>
      {couples.map((item, index) => <View key={index} style={styles.tabletViewRow}>
        {/* <Text style={styles.debugText}>view_ids {JSON.stringify(view_ids)}. item = {JSON.stringify(item)}</Text> */}
        <SingleDashboardView viewId={item[0]} chartWidth={chartWidth} />
        {item?.length > 1 ? <SingleDashboardView viewId={item[1]} chartWidth={chartWidth} /> : null}
      </View>
      )}
    </ScrollView>
  )

}
function StrategyForPhone({ view_ids }) {

}

function SingleDashboardView({ viewId, chartWidth }) {
  const rs = ReusableStyles
  const recordId = viewId
  const { useQuery } = injectQuery('obi.dashboard.view');
  const [pollingInterval, setPollingInterval] = useState(undefined)
  const query = useQuery({
    kwargs: {
      fields: [
        'id',
        'name',
        'type',
        'number_type',
        'x_field_ids',
        'y_field_ids',
        'polling_interval_milliseconds',
      ],
      domain: [
        ['id', '=', recordId],
      ]
    },
  },
  {
    pollingInterval,
  }
  );
  const { data, isLoading } = query
  const records = data?.records ?? emptyList
  const viewRecord = records?.length ? records[0] : emptyObject
  const st = odooApi.useControllerQuery({
    url: '/obi_dashboard/data',
    params: {
      view_id: recordId,
    },
  }, {
    skip: !recordId,
    pollingInterval,
  })

  useEffect(() => {
    const newValue = viewRecord?.polling_interval_milliseconds ? viewRecord?.polling_interval_milliseconds : undefined
    if(pollingInterval !== newValue){
      setPollingInterval(newValue)
    }
  }, [viewRecord?.polling_interval_milliseconds])
  
  const viewData = st.data ?? emptyObject

  const viewDataProps = {
    viewInfo: viewRecord,
    viewData: viewData,
    chartWidth,
  }
  return (
    <View style={styles.singleViewContainer}>
      {['number'].includes(viewRecord?.type) ? null : <Text>{viewRecord.name}</Text>}
      {/* <View style={styles.debugFixedWidth} /> */}
      {/* <Text style={styles.debugText}>{pollingInterval}</Text> */}
      {viewRecord?.type === 'line_graph' ? <CustomLineChart {...viewDataProps} /> : null}
      {viewRecord?.type === 'pie_chart' ? <CustomPieChart {...viewDataProps} /> : null}
      {viewRecord?.type === 'bar_chart' ? <CustomBarChart {...viewDataProps} /> : null}
      {viewRecord?.type === 'number' ? <CustomNumberMetric {...viewDataProps} /> : null}

      {/* <Text>viewRecord = {JSON.stringify(viewRecord)}</Text> */}
      {/* <Text>viewData = {JSON.stringify(viewData)}</Text> */}
      {st.error ? <Text style={styles.debugText}>{JSON.stringify(st.error)}</Text> : null}
    </View>
  )
}

function CustomNumberMetric({ viewInfo, viewData, chartWidth }) {
  return (
    <View style={[styles.numberViewContainer, { width: chartWidth }]}>
      <Text style={styles.numberTitleText}>{viewInfo.name}</Text>
      <Text style={styles.numberMetricText}>{viewData?.value}</Text>
    </View>
  )
}
function CustomLineChart({ viewInfo, viewData, chartWidth }) {
  const labels = viewData?.labels
  const numbers = viewData?.values
  if (numbers?.length) {
    return (<LineChart
      data={{
        labels: labels?.length > 5 ? undefined : labels,
        datasets: [
          {
            data: numbers,
          }
        ]
      }}
      width={chartWidth} // from react-native
      height={220}
      yAxisLabel="$"
      // yAxisSuffix="k"
      // yAxisInterval={1} // optional, defaults to 1
      chartConfig={chartConfig}
      bezier
      style={{
        marginVertical: 8,
        borderRadius: 16
      }}
    />
    )
  }
  return null
}

function CustomBarChart({ viewInfo, viewData, chartWidth }) {
  const labels = viewData?.labels
  const numbers = viewData?.values
  if (numbers?.length) {
    return (<BarChart
      verticalLabelRotation={30}

      data={{
        labels: labels?.length > 6 ? undefined : labels,
        datasets: [
          {
            data: numbers,
          }
        ]
      }}
      width={chartWidth} // from react-native
      height={220}
      yAxisLabel="$"
      // yAxisSuffix="k"
      // yAxisInterval={1} // optional, defaults to 1
      chartConfig={chartConfig}
      bezier
      style={{
        marginVertical: 8,
        borderRadius: 16
      }}
    />
    )
  }
  return null
}


function CustomPieChart({ viewData, chartWidth }) {
  // usage
  const data = []
  const groupby = viewData?.groupby
  const labels = viewData?.labels ?? []
  const colors = generatePieColors(viewData?.values?.length ?? 0);
  viewData?.values?.map && viewData?.values?.map((item, index) => {
    const pieSlice = {
      name: labels?.length >= index + 1 ? labels[index] : '',
      value: item,
      color: colors[index],
      legendFontColor: "#7F7F7F",
      legendFontSize: 12
    }
    data.push(pieSlice)
  })
  const data_x = [
    {
      name: "Seoul",
      population: 21500000,
      color: "rgba(131, 167, 234, 1)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: "Khartoum",
      population: 5500000,
      color: "rgba(0, 251, 234, 1)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
  ];

  return (
    <PieChart
      data={data}
      width={chartWidth}
      height={360}
      chartConfig={chartConfig}
      accessor={"value"}
      backgroundColor={"transparent"}
      paddingLeft={"15"}
      center={[40, 10]}
      absolute
    />
  )
}

function generatePieColors(length) {
  return Array.from({ length }, (_, i) =>
    `hsl(${(i * 360) / length}, 70%, 50%)`
  );
}

const chartConfig = {
  backgroundColor: "#e26a00",
  backgroundGradientFrom: "#fb8c00",
  backgroundGradientTo: "#ffa726",
  decimalPlaces: 2, // optional, defaults to 2dp
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16
  },
  propsForDots: {
    r: "6",
    strokeWidth: "2",
    stroke: "#ffa726"
  }
}

const styles = StyleSheet.create({
  tabletViewRow: {
    flexDirection: 'row',
    // borderWidth: 1, borderColor: 'red',
    justifyContent: 'space-between',
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  debugText: {
    color: 'red',
    borderWidth: 1, borderColor: 'purple',
  },
  singleViewContainer: {
    // maxWidth: 100,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  debugFixedWidth: {
    minWidth: 50,
    maxWidth: 50,
    minHeight: 50,
    maxHeight: 50,
    borderWidth: 1, borderColor: 'brown',
  },
  numberTitleText: {
    fontSize: 24,
    // fontWeight: 'bold',
  },
  numberViewContainer: {
    // borderWidth: 1, borderColor: 'red',
    margin: 5,
  },
  numberMetricText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold'
  },
});
