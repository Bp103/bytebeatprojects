//Coded by Bp103
//guitarbeatbyte 11-20-22
sr=44100,q=t/sr, 

t<1? (notetbl=[],notetbl[48]=440,ramp=[],ramp[0]=0,hat=[],noise=[], phrase=[[],[],[],[]]):0, // workaround to make arrays work

main();

function main(){
	if(t<1)noteTable();
	keyChange = (q/2)%16>8? 3:0;
	
	if(((q*4)%1)==0) randl = int(random()*10);
	if(((q*8)%1)==0) randr = int(random()*10);
	
	if(((q*4)%8==0) || (((q*4)%15)==0)) ramp[0]=8; ramp[0]-=3/sr;
	if((q*32)%8==0) ramp[1]=13; ramp[1] -=30/sr;
	if((q*16)%8==0) ramp[2]=13; ramp[2] -=15/sr;
	if((q*16)%16==0) ramp[3]=64; ramp[3] -=640/sr;
	if((q*32)%8==0) ramp[4]=13; ramp[4] -=200/sr;
	if(((t+sr/2)/sr*16)%16==0) ramp[5]=20; ramp[5] -=100/sr;
	for(i=0;i<20;i++)if(ramp[i]<=0) ramp[i]=0;
	
	//f sharp minor scale
	scale=[45,47,48,50, 52,53,55,57];
	
	ch  = sin(q*( notetbl[ scale[ ((int(q/2)%8)<4)*2 ]+keyChange	] *4))*ramp[0];
	ch -= sin(q*( notetbl[ scale[ ((int(q*2)%8)<4)+4 ]+keyChange	] *4))*ramp[0];
	ch &= sin(q*( notetbl[ scale[ ((int(q*1)%8)<4)+6 ]+keyChange	] *4))*ramp[0];
	ch*=(sin(q*32)*.4)+.8;
	
	ch+= sin(q*440)*ramp[3];
	ch+= (sin(q*880)*ramp[5])^sampler(hat,q,20,ramp[5]);
	
	samples = sampler(hat,q,110,ramp[4]);

	l =  (sin(q*( notetbl[ scale[ ((q/2)%16)>8?phrase[0+(((q/4)%16)>8)][int((q*3)%16)]:randl ]+keyChange ]/2 )*8)<0.1) *ramp[1];
	r =  (sin(q*( notetbl[ scale[ ((q/2)%16)>8?phrase[2+(((q/4)%16)>8)][int((q*6)%16)]:randr ]+keyChange ]/2 )*8)<0.8) *ramp[2];
	return [samples+l+ch+127,samples+r+ch+127];
}
function noteTable(){
	for(i=0;i<16;i++) {
		phrase[0][i]=int(random()*10);
		phrase[1][i]=int(random()*10);
		phrase[2][i]=int(random()*10);
		phrase[3][i]=int(random()*10);
	}
	hat[0]=256; for(i=1;i<hat[0];i++) hat[i]= sin(i&4) ^ (random()*255);
	
	notetbl[48]=440;
	for(i=49;i<96;i++) notetbl[i] = notetbl[i-1] * pow(2,1.0/12);
	for(i=47;i>0; i--) notetbl[i] = notetbl[i+1] / pow(2,1.0/12);
	notetbl[0]=0;
}
function sampler(sample,place,pitch,vol){return (sample[int((place*(pitch*(sample[0]-1)))%((sample[0]-1)+1))]/255)*vol;}
