import React from 'react';
import './square.css';

class Square extends React.Component {

    render() {
        if(this.props.selected) {
            return (
                <button 
                className="selected-square" 
                onClick={this.props.onClick} >
                    {this.props.value}
            
                </button>
            );
        } else {
            if(this.props.highlight) {
                return (
                    <button 
                    className="higlighted-square" 
                    onClick={this.props.onClick} >
                        {this.props.value}
                
                    </button>
                );
            } else {
                return (
                    <button 
                    className="square" 
                    onClick={this.props.onClick} >
                        {this.props.value}
                
                    </button>
                );
            }
        }
        
    }
}

export default Square;
