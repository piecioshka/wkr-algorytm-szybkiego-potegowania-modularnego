/**
 * @author Piotr Kowalski <piecioshka@gmail.com>
 * @see http://jsninja.pl/wkr-rozszerzony-algorytm-euklidesa/
 * @licence The MIT License {@link http://piecioshka.mit-license.org/}
 */
(function (root, factory) {
    root.App = factory(root._);
}(this, function (_) {
    'use strict';

    function App(options) {
        this.settings = _.extend({}, options);
        this.initialize();
    }

    App.prototype = {
        initialize: function () {
            var s = this.settings;

            _.bindAll(this, '_enterHandler', '_submitHandler');

            // after click submit do calculation
            s.submit.on('click', this._submitHandler);

            // print result on any input have been modify
            s.first.on('keydown', this._enterHandler);
            s.second.on('keydown', this._enterHandler);
            s.third.on('keydown', this._enterHandler);

            // set focus on first input
            s.first.focus();
        },

        _enterHandler: function (e) {
            // if `enter`
            if (e.keyCode === 13) {
                if (this._checkParams()) {
                    this._printResult(this._calculate());
                }
            } else {
                this._clearResult();
            }
        },

        _submitHandler: function (e) {
            if (this._checkParams()) {
                this._printResult(this._calculate());
            }
            e.preventDefault();
        },

        _checkParams: function () {
            var s = this.settings;

            var a = s.first.val();
            var b = s.second.val();
            var c = s.third.val();

            var errors = [];
            var status;

            if (!(/^\d+$/).test(a)) {
                errors.push('Niepoprawna wartość pierwszego parametru');
            }

            if (!(/^\d+$/).test(b)) {
                errors.push('Niepoprawna wartość drugiego parametru');
            }

            if (!(/^\d+$/).test(c)) {
                errors.push('Niepoprawna wartość trzeciego parametru');
            }

            if (_.size(errors)) {
                alert(_.first(errors));
            }

            // update status by error list
            status = !_.size(errors);

            return status;
        },

        _toBits: function (number) {
            var bits = Number(number).toString(2);
            return bits.split('');
        },

        _calculate: function () {
            var s = this.settings;
            var a = s.first.val();
            var b = s.second.val();
            var c = s.third.val();

            var data = [['xi', 'ai', 'ki']];
            var lsbBits = this._toBits(b).reverse();

            var i = 0;
            var xi = null;
            var ai = null;
            var ki = null;

            _.each(lsbBits, function (bit, index) {
                i++;

                if (xi === null) {
                    xi = 1;
                } else {
                    if (data[i - 1][2]) {
                        xi = (data[i - 1][0] * data[i - 1][1] ) % c;
                    } else {
                        xi = data[i - 1][0] % c;
                    }
                }

                if (ai === null) {
                    ai = +a;
                } else {
                    ai = (data[index][1] * data[index][1]) % c
                }

                ki = +bit;

                data.push([xi, ai, ki]);
            });

            i++;

            if (data[i - 1][2]) {
                xi = (data[i - 1][0] * data[i - 1][1] ) % c;
            } else {
                xi = data[i - 1][0] % c;
            }

            data.push([xi, '-', '-']);

            return data;
        },

        _printResult: function (result) {
            var $table = $('<table>').addClass('table table-bordered table-condensed');
            var $thead = $('<thead>');
            var $tbody = $('<tbody>');

            // -- header

            var $tr = $('<tr>').addClass('info');
            _.each(result.shift(), function (cell) {
                var $th = $('<th>').text(cell);
                $tr.append($th);
            });
            $thead.append($tr);
            $table.append($thead);

            // --- body

            _.each(result, function (rows, rowIndex) {
                var $tr = $('<tr>').addClass('active');
                _.each(rows, function (cell, cellIndex) {
                    var $td = $('<td>').text(cell);
                    if ((_.size(result) - 1) === rowIndex && cellIndex === 0) $td.addClass('danger');
                    $tr.append($td);
                });
                $tbody.append($tr);
            });

            $table.append($tbody);

            // show table
            this.settings.result.removeClass('hidden').html($table);
        },

        _clearResult: function () {
            this.settings.result.addClass('hidden');
        }
    };

    return App;
}));