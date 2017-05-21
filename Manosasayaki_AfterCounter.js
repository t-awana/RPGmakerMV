 //=============================================================================
// Manosasayaki_AfterCounter.js
// ----------------------------------------------------------------------------
// Copyright (c) 2017-2017 Sigureya
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/Sigureya/
//=============================================================================

/*:ja
 * @plugindesc 攻撃を受けた後に、スキルを使います。
 * 条件式や反撃時の行動も設定できます。
 * @author しぐれん（魔のささやき）
 * 
 * @param tagName
 * @desc カウンターの条件設定に使うタグ名を指定します。
 * @default CounterExt
 * 
 * @param msg_format
 * @desc 反撃による行動の時に、挿入する文章を設定します。
 * 空欄の場合、何もしません。
 * @default 反撃！
 * 
 * @help
 * 
 * パラメータは、デフォルトでは以下の形になっています。
 * <CounterExt:
 *    cond     = act.isPhysical()   #発動条件
 *    rate     = 100                #発動率
 *    priority = 0                  #優先度
 *    skill    = 1                  #使用するスキル
 *    mode     = target             #攻撃対象にならなかった時に判定するか
 * >
 * 
 * 複数の条件を設定したい場合、「CounterExt3」など、
 * 数字を付けて対応してください。
 * 9まで対応しています。
 * 
 * ■cond
 * 条件文を定義します。
 * 比較演算子は >　以外が使用可能です。
 * 条件文内部では以下の変数が参照できます。
 * act      : Game_actionが格納されます。
 * elementID: 属性番号が格納されます。
 * a        : カウンター使用者。
 * b        : 攻撃してきた相手。
 * skillID  : スキルのID。敵の行動がスキルでない場合は0。
 * itemID   : アイテムのID。敵の行動がアイテムでない場合は0。
 * 
 * ■rate
 * 反撃率を定義します。
 * 特徴の「反撃率」とほぼ同様です。
 * デフォルトの反撃率設定はすべて無視します。
 * 
 * ■skill
 * Nもしくはv[N]の形式で指定します。
 * (Nは整数)
 * v[N]の場合、変数からスキル番号を取り出します
 * 
 * ■priority
 * 優先順位を定義します。
 * 優先順位の高い物から反撃判定を行い、最初に条件を満たしたものから実行されます。
 * なお、priorityが同値の場合、
 * ステート > アクター > 職業 > 装備品の順で判定します。
 * ただし、この順序は実装によって異なるので保証しません。
 * ■mode
 * use,targetの2つを指定できます。
 * useは条件を満たすスキルが使用されたときにカウンターします。
 * targetは、条件を満たすスキルの攻撃対象になったときに発動します。
 *
 * ■opt
 * ※未実装です。
 * オプション項目を設定します。
 * カンマ区切りでopt = a,b,cとしていしてください。
 * count    カウンターの使用回数としてカウントしません。
 * cost    コストの支払いをしません。
 * 
 * ■サンプル
 * 魔法に対して50%で反撃。スキルを指定していないので、通常攻撃で反撃。
 * <CounterExt:
 *    cond  = act.isMagicSkill()
 *    rate  = 50
 * >
 * 魔法に対してID9のスキルで反撃。
 * <CounterExt:
 *    cond  = act.isMagicSkill()
 *    skill = 9
 * >
 * 魔法に対して変数1番で定義したIDのスキルで反撃。
 * <CounterExt:
 *    cond  = act.isMagicSkill()
 *    skill = v[1]
 * >
 * 自分のHPが50%を下回ると反撃。
 * <CounterExt:
 *    cond   = a.hpRate() < 0.5
 * >
 * 属性番号2に対して反撃。
 * <CounterExt:
 *    cond   = elementId === 2
 * >
 * スイッチ[1]がONの時に反撃。
 * <CounterExt:
 *    cond   = s(1)
 * >
 * 変数[1]が100の時に反撃。
 * <CounterExt:
 *    cond   = v(1)===100
 * >
 * 
 * 
 * ■更新履歴
 * var 0.9.1(2017/05/19) バグ修正とヘルプの修正
 * var 0.9.0(2017/05/19) 公開
 */
/*:
 * @plugindesc 
 * 
 * After receiving the attack, use the skill.
 * You can also set the trigger condition
 * @author しぐれん(siguren)
 * 
 * @param tagName
 * @desc Define the name part of <name: data>.
 * @default CounterExt
 * 
 * @param msg_format
 * @desc At the time of action by counterattack, set the sentences to be displayed.
 * If it is blank, I do not do anything.
 * @default CounterAttack!
 * 
 * @help
 * 
 * By default, the parameters are in the following form.
 * <CounterExt:
 *    cond     = true   #Invocation condition
 *    rate     = 100    #Activation rate
 *    priority = 0      #Priority when multiple conditions satisfy
 *    skill    = 1      #use skill
 *    mode     = target #Do you decide when it did not become an attack target
 * >
 * 
 * If you want to set multiple conditions, 
 * please attach a number such as "CounterExt3".
 * It corresponds to 9.
 * ■cond
 * Define conditional statements.
 * Comparison operators other than > are available.
 * The following variables can be referred to within the condition statement.
 * act      : Game_action is stored.
 * elementId: The attribute number is stored.
 * a        : Counter user.
 * b        : The opponent who attacked.
 * skillID  : ID of the skill. 0 if the opponent's action is not a skill.
 * itemID   : ID of the item. 0 if the opponent's action is not an item.
 *
 * ■rate
 * Define the counterattack rate.
 * It is almost the same as the characteristic "counter rate".
 * Ignore all default counter rate settings. * 
 * ■skill
 * Specify it in the form of N or v[N].
 * (N is an integer)
 * For v[N], retrieve the skill number from the variable.
 * ■priority
 * Define the priority.
 * Counterattack judgment is done from objects with high priority, 
 * and it will be executed from those that first fulfilled the condition.
 * If priority is the same,
 * State judged in the order of actor> occupation> equipment.
 * However, this order is not guaranteed because 
 * it varies depending on the implementation.
 * ■mode
 * use, target can be specified.
 * use counts when skills that satisfy the criteria are used.
 * target is activated when it becomes an attack target of a skill which satisfies the condition.
 * 

* ■ Sample
 * Counter Attack with 50% against magic. 
 * Because they did not designate skills, they attacked with regular attacks.
 * <CounterExt:
 * Cond = act.isMagicSkill ()
 * Rate = 50
 *>
 * Counterattack with the skill of ID 9 against magic.
 * <CounterExt:
 * Cond = act.isMagicSkill ()
 * Skill = 9
 *>
 * Counterattack with the skill of ID defined with variable 1 against magic.
 * <CounterExt:
 * Cond = act.isMagicSkill ()
 * Skill = v [1]
 *>
 * Counterattack if your HP falls below 50%.
 * <CounterExt:
 * Cond = a.hpRate () <0.5
 *>
 * Counterattack against attribute number 2.
 * <CounterExt:
 * Cond = elementId === 2
 *>
 * Counterattack when switch [1] is ON.
 * <CounterExt:
 * Cond = s (1)
 *>
 * Counterattack when variable [1] is 100.
 * <CounterExt:
 * Cond = v (1) === 100
 * > 
 * 

* ■ Update history
 * Var 0.9.0 (2017/05/21) Published in English
 *  */

var Imported = (Imported || {});
(function (global) {
'use strict';
var counter={};
var params = PluginManager.parameters('Manosasayaki_AfterCounter');

counter.tagName = params['tagName']||'CounterExt';
counter.modeReg =/(target|use)/;
counter.msg_format = params['msg_format'];

//=============================================================================
// Counter Class
//=============================================================================
function Counter() {
    this.initialize.apply(this,arguments);
}
Counter.prototype.initialize=function(){
    this.setSkillID(1);

    this._itemID = 0;
    this._priority = 0;
    this._rate = 1;
    this._cond = 'true';
    this._anime = 0;
    this._mode = 'target';
};
Counter.prototype.setAnimation =function(id){
    this._anime =id;
};
 

Counter.prototype.skillFromNumber=function(){
    return $dataSkills[this._id];
};

Counter.prototype.setSkillID =function(id){
    this._id =id;
    this._getItemFunc = Counter.prototype.skillFromNumber;
};
Counter.prototype.skillFromGameVariables=function(){
    return $dataSkills[$gameVariables.value(this._id)];
};
Counter.prototype.setSkillVariable =function(id){
    this._id =id;
    this._getItemFunc = Counter.prototype.skillFromGameVariables;
};

Counter.prototype.setSkill=function(value){
    this.numOrVariable(value, this.setSkillID, this.setSkillVariable );
};

Counter.prototype.item =function(){
    return this._getItemFunc.call(this);
};
Counter.prototype.rate =function(){
    return this._rate;

};
Counter.prototype.setRate=function(rate){
    this._rate = rate/100;

};
Counter.prototype.setMode =function(mode){
    var match = counter.modeReg.exec(mode);
    if(match){
        this._mode = match[1];
    }
};

Counter.prototype.priority =function(){
    return this._priority;
};
Counter.prototype.setPriority =function(p){
    this._priority = p;
};


Counter.prototype.setCondition =function(cond){
    this._cond=cond;
};

Counter.prototype.evalCondition=function(subject,action){

    var act       = action;
    var item      = action.item();
    var a         = action.subject();
    var b         = subject;
    var elementId = item.damage.elementId;
    var v         = $gameVariables.value.bind($gameVariables);
    var s         = $gameSwitches.value.bind($gameSwitches);
    
    var skillID = action.isSkill() ? item.id : 0;
    var itemID  = action.isItem()  ? item.id : 0;

    var result = false;
    try {
        result =!!eval(this._cond);
        
    } catch (e) {
        console.error(e.toString());
        throw new Error('条件式(cond)が不正です。式:' + this._cond);
    }
    return result;
};
Counter.prototype.numConvertTo =function(func,value){
    var num = Number(value);
    if(num !==NaN){
        func.call(this,num);
    }

};
Counter.prototype.numOrVariable =function(str,numFunc,variableFunc){
    var reg = /v\[(\d)\]/i;
    var match = reg.exec(str);
    if(match){
        console.log(match[1]);
        variableFunc.call(this,match[1]);
    }else{
        numFunc.call(this,Number( str ));
    }
};

Counter.prototype.patternMatch=function(key ,value){
    var k = key[0];


    switch (k) {
//        case 'cond':
        case 'c':
            this.setCondition(value);
            break;
//        case 'skill':
        case 's':
            this.setSkill(value);
            break;
//        case 'priority':
        case 'p':
            this.numConvertTo(this.setPriority,value);
            break;        
//        case 'rate':
        case 'r':
            this.numConvertTo(this.setRate,value);
            break;
//        case 'mode':
        case 'm':
            this.setMode(value);
            break;
        default:
            break;
    };
    
};

Counter.prototype.setMeta=function(metaStr){
    var reg = /(skill|cond|rate|priority|mode)\s*=(.*)/g;
    for(;;){
        var match = reg.exec(metaStr);
        if(!match){break;}
            this.patternMatch(match[1],match[2]);
    }
};
Counter.prototype.selectTargetIndex=function(action,opponent ){
    if(action.isForOpponent()){
        action.setTarget( opponent.index()  );
    }else if(action.isForFriend()){
        action.setTarget( action.subject().index()  );
    }
};

Counter.prototype.createAction=function(subject,opponentAction)
{
    var action = new Game_Action(subject);
    var item = this.item();
    if(item){
        action.setItemObject(item);
        this.selectTargetIndex(action,opponentAction.subject());
    }
    return action;
};
Counter.prototype.modeMathc=function(subject){
    if(this._mode ==='target'){
        if(!subject._targetedMA){
            return false;
        }
    }
    return true;
};
Counter.prototype.userCustomJudge =function(subject,opponentAction){
    return true;
};

Counter.prototype.Judge =function(subject,opponentAction){
    return Math.random() < this.rate()
        && this.userCustomJudge(subject,opponentAction)
        && this.evalCondition(subject,opponentAction)
        && subject.canUse(this.item()) ;
};
//=============================================================================
// DefineCounterTrait
//=============================================================================
counter.defineCounterTraitImple =function(obj,tagName){

    var counterEX = obj.meta[tagName];
    if( !counterEX ){
        return; 
    }

    var c_base = new Counter();
    c_base.setMeta(counterEX);
    obj.counter_Manosasayaki.push(c_base);
};

counter.defineCounterTrait=function(obj) {
    var ct = obj.counter_Manosasayaki;
    if(ct !==undefined){return;}

    obj.counter_Manosasayaki=[];
    var tagName = counter.tagName;
    counter.defineCounterTraitImple(obj,tagName);
    for(var i=0;i <=9;++i ){
        counter.defineCounterTraitImple(obj,tagName+i);
    }
};

//=============================================================================
// GameAction
//=============================================================================
Game_Action.prototype.isCounter=function(){
    return this._counterPriority_Manosasayaki!==undefined;
};

Game_Action.prototype.canCounter=function(){
    return !this.isCounter();
};
Game_Action.prototype.counterSpeed=function(){

    var result = this.speed()
    if(this.subject()._targeted){
        result +=10000;
    }
    return result;
};

//=============================================================================
// Game_Battler
//=============================================================================
Game_Battler.prototype.findCounterAciton=function(opponentAction){
    var result;
    var maxPriority = Number.MIN_SAFE_INTEGER;

    var traits= this.traitObjects();

    traits.forEach(function(t){
        var cm = t.counter_Manosasayaki;
        if(cm ===undefined){
            counter.defineCounterTrait(t);
            cm = t.counter_Manosasayaki;
        }
        for(var i=0,len = cm.length ;i < len; ++i ){
            var co_i = cm[i];
            var prio = co_i.priority();
            if(prio < maxPriority){continue;}
            if(!co_i.modeMathc(this)){continue;}

            if(co_i.Judge(this,opponentAction) ){
                var action =co_i.createAction(this,opponentAction );
                action._counterPriority_Manosasayaki=prio;
                result = action;
                maxPriority = prio;
            }
        }
    },this);
    return result;
};
//=============================================================================
// BattleManager
//=============================================================================
var zz_MA_AfterCounter_BattleManager_BattleManager_initMembers =BattleManager.initMembers;
BattleManager.initMembers =function(){
    this._reservedCounter =[];
};

var zz_MA_AfterCounter_BattleManager_updateTurn = BattleManager.updateTurn;
BattleManager.updateTurn =function(){
    if(this._reservedCounter.length > 0){
        if(!this._orgSubject){
            this._orgSubject =this._subject;
        }
        var counter = this._reservedCounter.shift();
        this._subject = counter.subject();
        this._subject._actions.unshift(counter);
    }else{
        if(this._orgSubject){
            this._subject = this._orgSubject;
            this._orgSubject = null;
        }
    }
    zz_MA_AfterCounter_BattleManager_updateTurn.call(this);
};
var zz_MA_AfterCounter_BattleManager_invokeNormalAction =BattleManager.invokeNormalAction;
BattleManager.invokeNormalAction=function(subject,target){
    zz_MA_AfterCounter_BattleManager_invokeNormalAction.apply(this,arguments);
    target._targetedMA =true;
};
BattleManager.counterActionSort =function(){
    this._reservedCounter.sort(function(a,b){
        return b.counterSpeed()-a.counterSpeed();
    });
};

var zz_MA_AfterCounter_BattleManager_endAction =BattleManager.endAction;
BattleManager.endAction =function(){

    zz_MA_AfterCounter_BattleManager_endAction.call(this);

    if(this._action.canCounter()){
        var counterUser = this._action.opponentsUnit().members();

        for(var i=0;i <counterUser.length;++i){
            var u= counterUser[i];
            var counterAction= u.findCounterAciton(this._action);
            if(counterAction){
                this._reservedCounter.push(counterAction);
            }
            u._targetedMA =false;
        }
        this.counterActionSort();
    }
};
if( counter.msg_format ){
    var  zz_MA_AfterCounter_Window_BattleLog_startAction =Window_BattleLog.prototype.startAction;
    Window_BattleLog.prototype.startAction=function(subject,action,targets){
        if(action.isCounter()){
            this.push('addText',counter.msg_format);
        }
        zz_MA_AfterCounter_Window_BattleLog_startAction.apply(this,arguments);
    };
}

//-------------------------------------------------------
global.Manosasayaki = (global.Manosasayaki||{});
global.Manosasayaki.counter = counter;

})(this);