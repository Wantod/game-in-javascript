var timeDecompte = function(time){
	var m_time = time * 1000;
	var dateFin = 0;
	var play = false;

	this.reload = function(){
		if(play){
			var date = new Date();
			var timeReste = dateFin - date.getTime();
			if(timeReste<0)
				timeReste = 0;
			m_time = timeReste;	
		}
	}

	this.getTime = function(){
		this.reload();
		return m_time/1000;
	};
	
	this.setTimeAdd = function(time){
		m_time += time * 1000;
		dateFin += time * 1000;
	};

	this.setTime = function(time){
		m_time = time * 1000;
		dateFin = time * 1000;
	};

	this.play = function(){
		var date = new Date();
		play = true;
		dateFin = date.getTime() + m_time;
		return m_time;
	};

	this.pause = function(){
		play = false;
	};

	return "time";
};

var timeCompteur = function(){
	var m_time = 0;
	var dateDebut = 0;
	var play = false;

	this.reload =function(){
		if(play){
			var date = new Date();
			return date.getTime() - dateDebut  + m_time;
		}else{
			return m_time;
		}
	}
	this.getTime = function(){
		return (this.reload())/1000;
	};
	
	this.setTimeAdd = function(time){
		m_time += time * 1000;
	};

	this.setTime = function(time){
		m_time = time * 1000;
	};

	this.play = function(){
		if(!play){
			var date = new Date();
			play = true;
			dateDebut = date.getTime();	
			return m_time;
		}
		return this.reload()/1000;
	};

	this.pause = function(){
		if(play){
			m_time = this.reload();
			play = false;
		}
		return this.reload()/1000;
	};

	return "time";
};

exports.timeCompteur = timeCompteur;
exports.timeDecompte = timeDecompte;