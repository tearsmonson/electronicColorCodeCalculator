#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

struct col
{
	char color[100];
	int ind;
	double multi;
	double tol;
};

struct col color_s[20];
FILE *fp_data;
FILE *fp_res;

void IniColor(struct col &color_s, char *color, int ind, double multi, double tol)
{
	strcpy(color_s.color,color);
	color_s.ind = ind;
	color_s.multi = multi;
	color_s.tol = tol;
}

void CreateTestCase(int num)
{
	int temp;
	char col1[100];
	char col2[100];
	char col3[100];
	char col4[100];
	fp_data = fopen("input.txt","w");
	fprintf(fp_data,"%d\n",num);

	for (int i = 0; i < num; i++)
	{
		temp = rand() % 12;
		strcpy(col1,color_s[temp].color);

		temp = rand() % 12;
		strcpy(col2,color_s[temp].color);

		temp = rand() % 10;
		if (temp == 8 || temp == 9)
			temp += 2;
		strcpy(col3,color_s[temp].color);

		temp = rand() % 12;
		strcpy(col4,color_s[temp].color);

		fprintf(fp_data,"%s %s %s %s\n",col1,col2,col3,col4);
	}
	fclose(fp_data);
}

void main()
{
	FILE *fp;
	int n;
	int n1_index,n2_index,n3_index,n4_index;
	double res;
	double tole;
	char str1[100];
	char str2[100];
	char str3[100];
	char str4[100];

	IniColor(color_s[0],"black",0,1,0);
	IniColor(color_s[1],"brown",1,10,1);
	IniColor(color_s[2],"red",2,100,2);
	IniColor(color_s[3],"orange",3,1000,0);
	IniColor(color_s[4],"yellow",4,10000,0);
	IniColor(color_s[5],"green",5,100000,0.5);
	IniColor(color_s[6],"blue",6,1000000,0.25);
	IniColor(color_s[7],"violet",7,10000000,0.1);
	IniColor(color_s[8],"grey",8,0,0.05);
	IniColor(color_s[9],"white",9,0,0);
	IniColor(color_s[10],"#FFD700",10,0.1,5);
	IniColor(color_s[11],"#C0C0C0",11,0.01,10);
//	printf("%s %d %d %d",color_s[0].color,color_s[0].ind,color_s[0].multi,color_s[0].tol);
	
	srand((unsigned)time(0));
	CreateTestCase(1000);

	fp = fopen("input.txt","r");
	fp_res = fopen("output.txt","w");
	fscanf(fp,"%d\n",&n);
	for (int i = 0; i < n; i++)
	{
		fscanf(fp,"%s %s %s %s\n",&str1,&str2,&str3,&str4);
//		printf("1:%s 2:%s 3:%s 4:%s\n",str1,str2,str3,str4);
		
		n1_index = 0, n2_index = 0, n3_index = 0, n4_index = 0;
		for (int j = 0; j <= 11; j++)
		{
			if (!strcmp(color_s[j].color,str1))
				n1_index = j;
			if (!strcmp(color_s[j].color,str2))
				n2_index = j;
			if (!strcmp(color_s[j].color,str3))
				n3_index = j;
			if (!strcmp(color_s[j].color,str4))
				n4_index = j;
		}
		res = (10 * color_s[n1_index].ind + color_s[n2_index].ind) * color_s[n3_index].multi;
		tole = color_s[n4_index].tol;
		//printf("res:%.3lf; tol:%.3lf\n",res,tole);
		fprintf(fp_res,"res:%.3lf; tol:%.3lf\n",res,tole);
	}
	fclose(fp);
	fclose(fp_res);
	system("pause");
	return;
}