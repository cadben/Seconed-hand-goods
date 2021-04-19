import { Select } from 'antd';
import React from 'react';
import request from '../../utils/request';

const { Option } = Select;

let timeout;

function fetch(value, callback) {
    
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }

  async function fake() {
    const result = await request('/nodeapi/getschool?keyword=' + value);
    if (result && result.data) {
        callback(result.data);
    }
  }

  timeout = setTimeout(fake, 300);
}

export default class SearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        data: [],
        value: '',
        serachValue: this.props.searchSchool,
    }
  }

  handleSearch = value => {
    // this.setState({ serachValue: value });
    this.props.setSearchSchool(value);
    if (value) {
        fetch(value, data => this.setState({ data }));
    } else {
        this.setState({ data: [] });
    }
  };

  handleChange = (e, options) => {
    // console.log('handlechange', e, options);
    // console.log(this.props);
    this.props.changeSchool(e);
    this.setState({ value: e });
    this.props.setSearchSchool(options.children );
  };

  
  render() {
    const options = this.state.data.map(d => <Option key={d.school_id}>{d.school_name}</Option>);
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      选择学校：<Select
      wid
        showSearch
        serachValue={this.state.serachValue}
        value={this.state.value}
        style={this.props.style}
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onSearch={this.handleSearch}
        onChange={this.handleChange}
        notFoundContent={null}
      >
        {options}
      </Select>
      </div>
    );
  }
}
