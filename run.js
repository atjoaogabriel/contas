(function() {
    let root = createScreenIn("50% 0", {
        title: "Contas",
        backbutton: false,
        autoshow: true
    });


    window.Store.createColletion('contas_info');

    const open_account = (id, name) => {
        let open_account_screen = createScreenIn("50% 0", {
            title: name,
            backbutton: true,
            autoshow: true,
            autoremove: true,
            children: {
                padding: {
                    children: {
                        button: {
                            innerHTML: "Adicionar lançamento",
                            classes: ['button'],
                            onclick: () => {
                                let move_add = createScreenIn("50% 0", {
                                    title: "Adicionar lançamento",
                                    backbutton: true,
                                    autoshow: true,
                                    autoremove: true,
                                    children: {
                                        padding: {
                                            children: {
                                                div: [{
                                                    classes: ['input'],
                                                    children: {
                                                        input: {
                                                            name: "value",
                                                            _type: 'number',
                                                            _step: '0.01',
                                                            _min: "0",
                                                            _pattern: "[0-9]*",
                                                            _inputmode: "numeric",
                                                            placeholder: "Valor do lançamento"
                                                        }
                                                    }
                                                }, {
                                                    classes: ['input'],
                                                    children: {
                                                        input: {
                                                            name: "text",
                                                            placeholder: "Texto do lançamento"
                                                        }
                                                    }
                                                }, {
                                                    classes: ['input'],
                                                    children: {
                                                        select: {
                                                            name: "type",
                                                            children: {
                                                                option: [
                                                                    { innerHTML: 'Saída', _value: 'credit' },
                                                                    { innerHTML: 'Entrada', _value: 'debit', _selected: "selected" }
                                                                ]
                                                            }
                                                        }
                                                    }
                                                }],
                                                button: {
                                                    innerHTML: "Lançar",
                                                    classes: ['button'],
                                                    onclick: () => {
                                                        let inputs = move_add.querySelectorAll('input[name],select[name]');
                                                        let data = {};
                                                        for (let index = 0; index < inputs.length; index++) {
                                                            const element = inputs.item(index);
                                                            if (element.value !== "") {
                                                                data[element.name] = element.value;
                                                            } else {
                                                                return alert("Preencha todos os campos.");
                                                            }
                                                        }
                                                        window.Store.getColletion(id).insert({
                                                            id: new Date().getTime(),
                                                            text: data.text,
                                                            type: data.type,
                                                            value: parseFloat(data.value)
                                                        });
                                                        move_add.close();
                                                        reload_move_list();
                                                    }
                                                }
                                            }
                                        }
                                    }
                                });
                            }
                        },
                        div: {
                            id: ['moves-list'],
                            classes: ['list', 'moves-list'],
                            innerHTML: '<spinner></spinner>'
                        }
                    }
                }
            }
        });
        const reload_move_list = () => {
            let list = window.Store.getColletion(id).list();
            let _o = { div: [] };
            let Total = 0;
            for (const move of list) {
                Total += move.type == "debit" ? move.value : move.value * -1;
            }

            _o.div.push({
                classes: ['item'],
                children: {
                    'item-header': {
                        innerHTML: '<span style="float:left;">Total</span>' + Total,
                        style: {
                            textAlign: 'end'
                        }
                    }
                }
            });
            for (const move of list) {
                _o.div.push({
                    classes: ['item', 'item-mini'],
                    children: {
                        'item-content': {
                            innerHTML: `<span style="float:left;">${move.text}</span><span style="float:right;color:${move.type == "debit" ? "#4CAF50" : "#EF5350"}">${move.value}</span>`,
                            style: {
                                textAlign: 'end'
                            }
                        }
                    }
                });
            }
            appendChildFromObject(open_account_screen.getContent().querySelector('#moves-list'), _o, true);
        };
        reload_move_list();
    };

    // reload_account_list
    const reload_account_list = () => {
        let list = window.Store.getColletion('contas_info').list();
        let _o = { div: [] };
        for (const account of list) {
            _o.div.push({
                classes: ['item'],
                onclick: () => {
                    open_account(account.id, account.name);
                },
                children: {
                    'item-header': {
                        innerHTML: account.name
                    },
                    'item-note': {
                        innerHTML: account.id
                    }
                }
            });
        }
        appendChildFromObject(root.getContent().querySelector('#root-account-list'), _o, true);
    };

    root.addEventListener('after-open', () => {
        let root_content = root.getContent();
        // add conta botão
        appendChildFromObject(root_content, {
            padding: {
                children: {
                    button: {
                        innerHTML: "Adicionar Conta",
                        classes: ['button'],
                        onclick: () => {
                            let conta_add = createScreenIn("50% 0", {
                                title: "Adicionar Conta",
                                backbutton: true,
                                autoshow: true,
                                autoremove: true,
                                children: {
                                    padding: {
                                        children: {
                                            div: {
                                                classes: ['input', 'account-name-input'],
                                                children: {
                                                    input: {
                                                        name: "account_name",
                                                        placeholder: "Nome da conta"
                                                    }
                                                }
                                            },
                                            button: {
                                                innerHTML: "Salvar",
                                                classes: ['button'],
                                                onclick: () => {
                                                    let account_name = conta_add.querySelector('.account-name-input input[name="account_name"]');
                                                    if (account_name.value !== "") {
                                                        let id = 'account_' + (new Date().getTime());
                                                        window.Store.getColletion('contas_info').insert({
                                                            id: id,
                                                            name: account_name.value
                                                        });
                                                        window.Store.createColletion(id);
                                                        conta_add.close();
                                                        reload_account_list();
                                                    } else {
                                                        alert("Preencha todos os campos.");
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            });
                        }
                    },
                    div: {
                        id: "root-account-list",
                        classes: ['list', 'account-list'],
                        innerHTML: '<spinner></spinner>'
                    }
                }
            }

        });
        reload_account_list();
    });
})();