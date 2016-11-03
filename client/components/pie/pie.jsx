var Pie = React.createClass({
    render: function() {
        return (
            <div>
                <h2>Pie</h2>
                <button onClick={this.click}>Click</button>
            </div>
        );
    },
    click: function() {
        alert(1);
    }
});

module.exports = Pie;